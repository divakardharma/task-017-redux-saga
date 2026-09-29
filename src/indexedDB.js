import CryptoJS from "crypto-js";

const AES_KEY = "task017-secret-key";
const DB_NAME = "PatientDB";
const STORE_NAME = "offlinePatients";


// ===============================
// AES ENCRYPT
// ===============================

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    AES_KEY
  ).toString();
};


// ===============================
// AES DECRYPT
// ===============================

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedData,
    AES_KEY
  );

  return JSON.parse(
    bytes.toString(CryptoJS.enc.Utf8)
  );
};


// ===============================
// OPEN INDEXED DB
// ===============================

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};


// ===============================
// SAVE OFFLINE PATIENT
// ===============================

export const saveOfflinePatient = async (patient) => {
  const db = await openDB();

  const encryptedData = encryptData(patient);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(STORE_NAME);

    const request = store.add({
      data: encryptedData,
    });

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// ===============================
// GET OFFLINE PATIENTS
// ===============================

export const getOfflinePatients = async () => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      const patients = request.result.map((item) => ({
        ...decryptData(item.data),

        // IndexedDB record ID
        offlineId: item.id,
      }));

      resolve(patients);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};


// ===============================
// DELETE ONE OFFLINE PATIENT
// ===============================

export const deleteOfflinePatient = async (id) => {
  const db = await openDB();

  const transaction = db.transaction(
    STORE_NAME,
    "readwrite"
  );

  const store = transaction.objectStore(STORE_NAME);

  store.delete(id);
};