import { db, storage } from '@/constants/firebase';
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AdviceHistory, PhotoData, CoachingStyle } from '@/contexts/AppContext';

export interface SaveAdviceParams {
  userId: string;
  photoUri: string;
  photoData: PhotoData;
  advice: string;
  intent: string;
  coachingStyle: CoachingStyle;
}

/**
 * アドバイス履歴をFirestoreに保存する
 */
export const saveAdviceHistory = async (params: SaveAdviceParams): Promise<string> => {
  const { userId, photoUri, photoData, advice, intent, coachingStyle } = params;

  try {
    // 1. 画像をFirebase Storageにアップロード
    const response = await fetch(photoUri);
    const blob = await response.blob();
    const timestamp = Date.now();
    const filename = `advice-photos/${userId}/${timestamp}.jpg`;
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    // 2. PhotoDataからundefinedの値を除外
    const cleanPhotoData: Record<string, any> = {};
    Object.entries(photoData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleanPhotoData[key] = value;
      }
    });

    // 3. Firestoreにアドバイス履歴を保存
    const docRef = await addDoc(collection(db, 'adviceHistory'), {
      userId,
      photoUrl: downloadURL,
      photoData: cleanPhotoData,
      advice,
      intent,
      coachingStyle,
      createdAt: Timestamp.now(),
    });

    console.log('Advice history saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving advice history:', error);
    throw error;
  }
};

/**
 * ユーザーのアドバイス履歴を取得する
 */
export const getAdviceHistory = async (userId: string): Promise<AdviceHistory[]> => {
  try {
    const q = query(
      collection(db, 'adviceHistory'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const history: AdviceHistory[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      history.push({
        id: doc.id,
        photoUri: data.photoUrl,
        photoData: data.photoData,
        advice: data.advice,
        intent: data.intent,
        coachingStyle: data.coachingStyle,
        createdAt: data.createdAt.toDate(),
      });
    });

    return history;
  } catch (error) {
    console.error('Error getting advice history:', error);
    throw error;
  }
};
