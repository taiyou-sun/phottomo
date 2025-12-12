export interface Lens {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  imageUrl: string;
  suitableFor: string[];
  focalLengthType: string[];
}

export const lenses: Lens[] = [
  {
    id: 'xf16-80',
    name: 'XF16-80mmF4 R OIS WR',
    price: '¥90,000〜',
    description: '旅行やスナップに最適な万能標準ズーム。防塵防滴で安心して使える。',
    features: ['手ぶれ補正', '防塵防滴', '万能焦点距離', '軽量設計'],
    imageUrl: 'https://images.unsplash.com/photo-1606980707986-a7e7e0c5e98a?w=400',
    suitableFor: ['旅行', '万能', '風景'],
    focalLengthType: ['zoom', 'standard'],
  },
  {
    id: 'xf18-55',
    name: 'XF18-55mmF2.8-4 R LM OIS',
    price: '¥65,000〜',
    description: 'コストパフォーマンス抜群のキットレンズ。初心者に最適な標準ズーム。',
    features: ['手ぶれ補正', 'コンパクト', '標準ズーム', '高コスパ'],
    imageUrl: 'https://images.unsplash.com/photo-1606983339852-8e1e67e59b7f?w=400',
    suitableFor: ['初心者', '万能', '旅行'],
    focalLengthType: ['zoom', 'standard'],
  },
  {
    id: 'xf56-12',
    name: 'XF56mmF1.2 R WR',
    price: '¥125,000〜',
    description: '美しいボケ味のポートレートレンズ。F1.2の大口径で暗所にも強い。',
    features: ['F1.2大口径', '美しいボケ', '防塵防滴', 'ポートレート最適'],
    imageUrl: 'https://images.unsplash.com/photo-1606986628062-3b0a929a8e88?w=400',
    suitableFor: ['人物', 'ポートレート', '暗所'],
    focalLengthType: ['prime', 'standard'],
  },
  {
    id: 'xf70-300',
    name: 'XF70-300mmF4-5.6 R LM OIS WR',
    price: '¥95,000〜',
    description: '望遠撮影に最適。野生動物やスポーツ撮影に。防塵防滴で屋外でも安心。',
    features: ['望遠ズーム', '手ぶれ補正', '防塵防滴', '軽量設計'],
    imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
    suitableFor: ['スポーツ', '野生動物', '望遠'],
    focalLengthType: ['zoom', 'telephoto'],
  },
  {
    id: 'xf16-14',
    name: 'XF16mmF1.4 R WR',
    price: '¥110,000〜',
    description: '広角単焦点レンズ。風景や建築撮影に最適。F1.4で星空撮影にも。',
    features: ['F1.4大口径', '広角24mm相当', '防塵防滴', '星空撮影'],
    imageUrl: 'https://images.unsplash.com/photo-1606980707986-23a1e1ce7ccd?w=400',
    suitableFor: ['風景', '建築', '星空'],
    focalLengthType: ['prime', 'wide'],
  },
  {
    id: 'xf23-14',
    name: 'XF23mmF1.4 R LM WR',
    price: '¥105,000〜',
    description: '標準単焦点レンズ。スナップや街撮りに最適な画角。',
    features: ['F1.4大口径', '35mm相当', '防塵防滴', 'スナップ最適'],
    imageUrl: 'https://images.unsplash.com/photo-1606984915385-e0e4a5f49e80?w=400',
    suitableFor: ['スナップ', '街撮り', '万能'],
    focalLengthType: ['prime', 'standard'],
  },
  {
    id: 'xf80-macro',
    name: 'XF80mmF2.8 R LM OIS WR Macro',
    price: '¥140,000〜',
    description: 'マクロ撮影専用レンズ。等倍撮影可能で小物や花の撮影に最適。',
    features: ['等倍マクロ', '手ぶれ補正', '防塵防滴', 'ポートレートも'],
    imageUrl: 'https://images.unsplash.com/photo-1606980707986-a7e7e0c5e98a?w=400',
    suitableFor: ['マクロ', '花', '小物'],
    focalLengthType: ['prime', 'telephoto'],
  },
];

export const selectLens = (answers: any): { recommended: Lens; alternatives: Lens[] } => {
  const subject = answers.subject;
  const focalLength = answers.focalLength;
  const aperture = answers.aperture;
  const budget = answers.budget;

  let recommended: Lens;
  let alternatives: Lens[] = [];

  if (subject === 'macro') {
    recommended = lenses.find(l => l.id === 'xf80-macro') || lenses[6];
    alternatives = [lenses.find(l => l.id === 'xf56-12'), lenses.find(l => l.id === 'xf23-14')].filter(Boolean) as Lens[];
  } else if (subject === 'landscape') {
    recommended = lenses.find(l => l.id === 'xf16-14') || lenses[4];
    alternatives = [lenses.find(l => l.id === 'xf16-80'), lenses.find(l => l.id === 'xf18-55')].filter(Boolean) as Lens[];
  } else if (subject === 'portrait') {
    recommended = lenses.find(l => l.id === 'xf56-12') || lenses[2];
    alternatives = [lenses.find(l => l.id === 'xf80-macro'), lenses.find(l => l.id === 'xf23-14')].filter(Boolean) as Lens[];
  } else if (subject === 'sports') {
    recommended = lenses.find(l => l.id === 'xf70-300') || lenses[3];
    alternatives = [lenses.find(l => l.id === 'xf16-80'), lenses.find(l => l.id === 'xf56-12')].filter(Boolean) as Lens[];
  } else if (focalLength === 'wide') {
    recommended = lenses.find(l => l.id === 'xf16-14') || lenses[4];
    alternatives = [lenses.find(l => l.id === 'xf16-80'), lenses.find(l => l.id === 'xf18-55')].filter(Boolean) as Lens[];
  } else if (focalLength === 'telephoto') {
    recommended = lenses.find(l => l.id === 'xf70-300') || lenses[3];
    alternatives = [lenses.find(l => l.id === 'xf56-12'), lenses.find(l => l.id === 'xf80-macro')].filter(Boolean) as Lens[];
  } else if (focalLength === 'prime') {
    if (aperture === 'high') {
      recommended = lenses.find(l => l.id === 'xf56-12') || lenses[2];
      alternatives = [lenses.find(l => l.id === 'xf23-14'), lenses.find(l => l.id === 'xf16-14')].filter(Boolean) as Lens[];
    } else {
      recommended = lenses.find(l => l.id === 'xf23-14') || lenses[5];
      alternatives = [lenses.find(l => l.id === 'xf56-12'), lenses.find(l => l.id === 'xf16-14')].filter(Boolean) as Lens[];
    }
  } else {
    if (budget === 'low') {
      recommended = lenses.find(l => l.id === 'xf18-55') || lenses[1];
      alternatives = [lenses.find(l => l.id === 'xf16-80'), lenses.find(l => l.id === 'xf23-14')].filter(Boolean) as Lens[];
    } else {
      recommended = lenses.find(l => l.id === 'xf16-80') || lenses[0];
      alternatives = [lenses.find(l => l.id === 'xf18-55'), lenses.find(l => l.id === 'xf56-12')].filter(Boolean) as Lens[];
    }
  }

  return { recommended, alternatives };
};
