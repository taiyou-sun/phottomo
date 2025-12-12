export interface Camera {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  imageUrl: string;
  suitableFor: string[];
  experienceLevel: string[];
}

export const cameras: Camera[] = [
  {
    id: 'xt5',
    name: 'FUJIFILM X-T5',
    price: '¥270,000〜',
    description: '高画質と機動性を両立した万能モデル。40MP高解像センサーで風景からポートレートまで幅広く対応。',
    features: ['40MPセンサー', '5軸手ぶれ補正', 'クラシカルデザイン', '4K/60p動画'],
    imageUrl: 'https://images.unsplash.com/photo-1606980707986-23a1e1ce7ccd?w=400',
    suitableFor: ['風景', 'ポートレート', '街撮り'],
    experienceLevel: ['intermediate', 'advanced'],
  },
  {
    id: 'xs20',
    name: 'FUJIFILM X-S20',
    price: '¥190,000〜',
    description: 'コンパクトで使いやすいオールラウンダー。動画撮影にも強く、初心者から中級者まで対応。',
    features: ['26MPセンサー', 'AI被写体検出AF', 'バリアングル液晶', '6K動画'],
    imageUrl: 'https://images.unsplash.com/photo-1606984915385-e0e4a5f49e80?w=400',
    suitableFor: ['人物', '動画', '旅行'],
    experienceLevel: ['beginner', 'intermediate'],
  },
  {
    id: 'xh2s',
    name: 'FUJIFILM X-H2S',
    price: '¥350,000〜',
    description: 'プロ仕様のスピードモンスター。超高速連写と動画性能でスポーツ・野生動物撮影に最適。',
    features: ['26MP積層センサー', '40fps連写', '8K/30p動画', 'プロ級AF性能'],
    imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
    suitableFor: ['スポーツ', '野生動物', 'プロ動画'],
    experienceLevel: ['advanced'],
  },
  {
    id: 'xe4',
    name: 'FUJIFILM X-E4',
    price: '¥130,000〜',
    description: 'コンパクトで軽量、街撮りに最適なレンジファインダースタイル。シンプルな操作性が魅力。',
    features: ['26MPセンサー', '軽量364g', 'クラシックデザイン', 'チルト液晶'],
    imageUrl: 'https://images.unsplash.com/photo-1606983339852-8e1e67e59b7f?w=400',
    suitableFor: ['街撮り', '旅行', 'スナップ'],
    experienceLevel: ['beginner', 'intermediate'],
  },
  {
    id: 'xt30ii',
    name: 'FUJIFILM X-T30 II',
    price: '¥140,000〜',
    description: '小型軽量で高性能。エントリーモデルとして最適なバランスの取れたカメラ。',
    features: ['26MPセンサー', 'コンパクト設計', 'フィルムシミュレーション', '4K動画'],
    imageUrl: 'https://images.unsplash.com/photo-1606986628062-3b0a929a8e88?w=400',
    suitableFor: ['初心者', '旅行', 'ポートレート'],
    experienceLevel: ['beginner'],
  },
  {
    id: 'xh2',
    name: 'FUJIFILM X-H2',
    price: '¥320,000〜',
    description: '40MP超高解像モデル。風景や商品撮影など、細部までこだわる撮影に最適。',
    features: ['40MPセンサー', '8K/30p動画', 'ピクセルシフトマルチショット', 'プロ仕様'],
    imageUrl: 'https://images.unsplash.com/photo-1606980707986-a7e7e0c5e98a?w=400',
    suitableFor: ['風景', '商品撮影', 'スタジオ'],
    experienceLevel: ['advanced'],
  },
];

export const selectCamera = (surveyAnswers: any): { recommended: Camera; alternatives: Camera[] } => {
  const experience = surveyAnswers.experience;
  const subject = surveyAnswers.subject;
  const budget = surveyAnswers.budget;

  let recommended: Camera;
  let alternatives: Camera[] = [];

  if (experience === 'beginner') {
    if (budget === '10-20') {
      recommended = cameras.find(c => c.id === 'xt30ii') || cameras[1];
      alternatives = [cameras.find(c => c.id === 'xe4'), cameras.find(c => c.id === 'xs20')].filter(Boolean) as Camera[];
    } else {
      recommended = cameras.find(c => c.id === 'xs20') || cameras[1];
      alternatives = [cameras.find(c => c.id === 'xt30ii'), cameras.find(c => c.id === 'xt5')].filter(Boolean) as Camera[];
    }
  } else if (experience === 'intermediate') {
    if (subject === 'landscape') {
      recommended = cameras.find(c => c.id === 'xt5') || cameras[0];
      alternatives = [cameras.find(c => c.id === 'xh2'), cameras.find(c => c.id === 'xs20')].filter(Boolean) as Camera[];
    } else if (subject === 'video') {
      recommended = cameras.find(c => c.id === 'xs20') || cameras[1];
      alternatives = [cameras.find(c => c.id === 'xh2s'), cameras.find(c => c.id === 'xt5')].filter(Boolean) as Camera[];
    } else {
      recommended = cameras.find(c => c.id === 'xt5') || cameras[0];
      alternatives = [cameras.find(c => c.id === 'xs20'), cameras.find(c => c.id === 'xe4')].filter(Boolean) as Camera[];
    }
  } else {
    if (subject === 'sports' || surveyAnswers.af === 'critical') {
      recommended = cameras.find(c => c.id === 'xh2s') || cameras[2];
      alternatives = [cameras.find(c => c.id === 'xh2'), cameras.find(c => c.id === 'xt5')].filter(Boolean) as Camera[];
    } else if (surveyAnswers.sensor === 'high-res') {
      recommended = cameras.find(c => c.id === 'xh2') || cameras[5];
      alternatives = [cameras.find(c => c.id === 'xt5'), cameras.find(c => c.id === 'xh2s')].filter(Boolean) as Camera[];
    } else {
      recommended = cameras.find(c => c.id === 'xh2s') || cameras[2];
      alternatives = [cameras.find(c => c.id === 'xh2'), cameras.find(c => c.id === 'xt5')].filter(Boolean) as Camera[];
    }
  }

  return { recommended, alternatives };
};
