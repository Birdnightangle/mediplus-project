// Minimal auth helper using compat SDK + Firestore for storing profile/role
window.firebaseAuth = (function() {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const STORAGE_KEY = 'mh_user';

  async function fetchProfile(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      return doc.exists ? doc.data() : null;
    } catch (e) {
      console.warn('fetchProfile error', e);
      return null;
    }
  }

  function saveLocal(userObj) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
      window.currentUserProfile = userObj;
    } catch (e) { /* ignore */ }
  }

  function clearLocal() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.currentUserProfile = null;
    } catch (e) { /* ignore */ }
  }

  // Keep local store in sync when auth state changes
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const profile = await fetchProfile(user.uid);
      const info = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || (profile && profile.name) || null,
        profile: profile || null,
        lastLoginAt: new Date().toISOString()
      };
      saveLocal(info);

      // If currently on login page, go to index
      const path = location.pathname.split('/').pop();
      if (path === 'login.html' || path === '') {
        location.href = 'index.html';
      }
    } else {
      clearLocal();
    }
  });

  return {
    // Sign in and return profile; also store login info locally
    signIn: async (email, password) => {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const profile = await fetchProfile(cred.user.uid);
      const info = {
        uid: cred.user.uid,
        email: cred.user.email || null,
        displayName: cred.user.displayName || (profile && profile.name) || null,
        profile: profile || null,
        lastLoginAt: new Date().toISOString()
      };
      saveLocal(info);
      return { cred, profile };
    },

    signOut: async () => {
      await auth.signOut();
      clearLocal();
    },

    // Register a doctor and store their profile in Firestore + local store
    registerDoctor: async (data) => {
      const cred = await auth.createUserWithEmailAndPassword(data.email, data.password);
      const uid = cred.user.uid;
      const profileData = {
        name: data.name,
        degree: data.degree,
        college: data.college,
        experience: data.experience || 0,
        hospital: data.hospital,
        mobile: data.mobile,
        role: 'doctor',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await db.collection('users').doc(uid).set(profileData);
      await cred.user.updateProfile({ displayName: data.name });

      const info = {
        uid,
        email: cred.user.email,
        displayName: data.name,
        profile: profileData,
        lastLoginAt: new Date().toISOString()
      };
      saveLocal(info);
      return { cred, profile: profileData };
    },

    // Call from pages to redirect unauthenticated users to login
    requireAuth: (opts = {}) => {
      const redirectTo = opts.redirectTo || 'login.html';
      // If local storage already has a logged user, do nothing.
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return;
      } catch (e) {}
      // Otherwise rely on auth state
      auth.onAuthStateChanged(user => {
        if (!user) location.href = redirectTo;
      });
    },

    getCurrentUserProfile: () => {
      try {
        const s = localStorage.getItem(STORAGE_KEY);
        return s ? JSON.parse(s) : window.currentUserProfile || null;
      } catch (e) { return window.currentUserProfile || null; }
    }
  };
})();