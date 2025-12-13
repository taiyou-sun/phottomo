import { CoachingStyle } from '@/contexts/AppContext';

export interface StyleOption {
  id: CoachingStyle;
  name: string;
  description: string;
  sampleAdvice: string[];
  emoji: string;
}

export const coachingStyles: StyleOption[] = [
  {
    id: 'phottomo',
    name: 'ふぉっとも君',
    emoji: '📷',
    description: '優しく楽しい、猫のコーチ',
    sampleAdvice: [
      '絞りをF8にすると、手前から奥までピントが合うニャ！',
      'ISOは低く保つと、とってもきれいな写真になるニャン！',
    ],
  },
  {
    id: 'logical',
    name: '写真博士',
    emoji: '🔬',
    description: '専門用語と数値を用いた論理的なアドバイスをくれるコーチ',
    sampleAdvice: [
      '被写界深度を最大化するため、F8〜F11の絞り値を推奨します。',
      'ISO感度は100〜400に設定することで、S/N比が向上します。',
    ],
  },
  {
    id: 'supportive',
    name: 'カウンセラー',
    emoji: '🤝',
    description: '励ましながら優しく教えてくれるコーチ',
    sampleAdvice: [
      '大丈夫、絞りをF8にするだけで、素敵な風景写真が撮れますよ！',
      'ISOを低く保つと、とってもきれいな写真になります。焦らずゆっくりね。',
    ],
  },
  {
    id: 'spartan',
    name: 'スパルタ鬼軍曹',
    emoji: '💪',
    description: '厳しく本格指導してくれるコーチ！',
    sampleAdvice: [
      '絞りはF8〜F11だ！手前から奥まで全部シャープに撮れ！',
      'ISOは100〜400に保て！ノイズなど許されん！',
    ],
  },
];
