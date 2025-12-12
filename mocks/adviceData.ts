import { CoachingStyle } from '@/contexts/AppContext';

export interface ShootingIntent {
  id: string;
  title: string;
  description: string;
  baseAdvice: string[];
  settingsSuggestions: {
    aperture: string;
    iso: string;
    shutterSpeed: string;
  };
}

export const shootingIntents: ShootingIntent[] = [
  {
    id: 'landscape',
    title: '風景の美しさを優先',
    description: '全体をくっきりと、奥行きのある風景を撮影',
    baseAdvice: [
      '絞りをF8〜F11に設定すると、手前から奥までピントが合います',
      'ISOは低く保つことで、ノイズの少ないクリアな画質になります',
      '三脚を使うと、低速シャッターでも手ブレを防げます',
      'ゴールデンアワーを狙うと、美しい光が得られます',
    ],
    settingsSuggestions: {
      aperture: 'F8〜F11',
      iso: '100〜400',
      shutterSpeed: '1/60〜1/250',
    },
  },
  {
    id: 'people',
    title: '人物を優先',
    description: '背景をぼかして人物を際立たせる',
    baseAdvice: [
      '絞りをF1.4〜F2.8に開けると、美しいボケ味が得られます',
      '被写体の目にピントを合わせることが重要です',
      'ISOを上げることで、暗い場所でも表情を明るく撮れます',
      '自然光を活用すると、柔らかい表情が撮れます',
    ],
    settingsSuggestions: {
      aperture: 'F1.4〜F2.8',
      iso: '400〜1600',
      shutterSpeed: '1/125〜1/500',
    },
  },
  {
    id: 'emotion',
    title: '感情的な雰囲気',
    description: 'ムードや感情を重視した表現',
    baseAdvice: [
      'アンダー露出で撮影すると、ドラマチックな雰囲気になります',
      'フィルムシミュレーションを活用すると、個性的な表現ができます',
      '光と影のコントラストを意識してみましょう',
      '色温度を調整することで、感情的な色合いを演出できます',
    ],
    settingsSuggestions: {
      aperture: 'F2.8〜F5.6',
      iso: '800〜3200',
      shutterSpeed: '1/60〜1/250',
    },
  },
];

export const transformAdviceByStyle = (baseAdvice: string[], style: CoachingStyle): string[] => {
  switch (style) {
    case 'phottomo':
      return baseAdvice.map(advice => {
        if (advice.includes('絞り')) {
          return advice.replace(/です$/, 'ニャ！');
        }
        if (advice.includes('ISO')) {
          return advice.replace(/なります$/, 'なるニャン！');
        }
        if (advice.includes('三脚')) {
          return advice.replace(/防げます$/, '防げるニャ！');
        }
        if (advice.includes('ゴールデン')) {
          return advice.replace(/得られます$/, '得られるニャン！');
        }
        if (advice.includes('ボケ')) {
          return advice.replace(/得られます$/, '得られるニャ！');
        }
        if (advice.includes('目')) {
          return advice.replace(/重要です$/, '大切ニャ！');
        }
        if (advice.includes('表情')) {
          return advice.replace(/撮れます$/, '撮れるニャン！');
        }
        if (advice.includes('自然光')) {
          return advice.replace(/撮れます$/, '撮れるニャ！');
        }
        if (advice.includes('アンダー')) {
          return advice.replace(/なります$/, 'なるニャン！');
        }
        if (advice.includes('フィルム')) {
          return advice.replace(/できます$/, 'できるニャ！');
        }
        if (advice.includes('コントラスト')) {
          return advice.replace(/みましょう$/, 'みるニャ！');
        }
        if (advice.includes('色温度')) {
          return advice.replace(/できます$/, 'できるニャン！');
        }
        return advice.replace(/です$|ます$/, 'ニャ');
      });

    case 'logical':
      return baseAdvice.map(advice => {
        if (advice.includes('絞り')) {
          return advice.replace('絞りをF8〜F11に設定すると、手前から奥までピントが合います', 
            '被写界深度を最大化するため、F8〜F11の絞り値を推奨します。回折現象を考慮すると、この範囲が最適です。');
        }
        if (advice.includes('ISO')) {
          return advice.replace('ISOは低く保つことで、ノイズの少ないクリアな画質になります',
            'ISO感度は100〜400に設定することで、S/N比が向上し、高画質な画像が得られます。');
        }
        if (advice.includes('三脚')) {
          return advice.replace('三脚を使うと、低速シャッターでも手ブレを防げます',
            '三脚を使用することで、1/60秒以下のシャッター速度でも画像の鮮鋭度を保てます。');
        }
        if (advice.includes('ゴールデン')) {
          return advice.replace('ゴールデンアワーを狙うと、美しい光が得られます',
            '日の出・日の入り前後の色温度2000〜3500Kの時間帯は、最適な光質が得られます。');
        }
        if (advice.includes('ボケ')) {
          return advice.replace('絞りをF1.4〜F2.8に開けると、美しいボケ味が得られます',
            'F1.4〜F2.8の開放絞りで被写界深度を浅くすることで、背景のボケ量が最大化されます。');
        }
        if (advice.includes('目')) {
          return advice.replace('被写体の目にピントを合わせることが重要です',
            '顔認識AFを使用し、瞳にピントを合わせることで、ポートレートの成功率が向上します。');
        }
        if (advice.includes('ISOを上げる')) {
          return advice.replace('ISOを上げることで、暗い場所でも表情を明るく撮れます',
            '露出不足を防ぐため、ISO感度を400〜1600に上げることを推奨します。ノイズリダクション機能を併用してください。');
        }
        if (advice.includes('自然光')) {
          return advice.replace('自然光を活用すると、柔らかい表情が撮れます',
            '拡散した自然光（曇天や窓からの光）は、光の方向性が弱く、肌の質感を柔らかく表現できます。');
        }
        if (advice.includes('アンダー')) {
          return advice.replace('アンダー露出で撮影すると、ドラマチックな雰囲気になります',
            '露出補正を-0.7〜-1.3EVに設定することで、コントラストが強調され、ドラマチックな表現が可能です。');
        }
        if (advice.includes('フィルム')) {
          return advice.replace('フィルムシミュレーションを活用すると、個性的な表現ができます',
            'FUJIFILMのフィルムシミュレーション（Velvia、Pro Neg.等）を使用することで、独自の色再現性を得られます。');
        }
        if (advice.includes('コントラスト')) {
          return advice.replace('光と影のコントラストを意識してみましょう',
            '光と影の明暗比を5:1以上に設定することで、立体感とドラマ性が向上します。');
        }
        if (advice.includes('色温度')) {
          return advice.replace('色温度を調整することで、感情的な色合いを演出できます',
            'ホワイトバランスを手動で2500K〜10000Kの範囲で調整することで、意図的な色調表現が可能です。');
        }
        return advice;
      });

    case 'supportive':
      return baseAdvice.map(advice => {
        if (advice.includes('絞り')) {
          return '大丈夫、絞りをF8〜F11にするだけで、素敵な風景写真が撮れますよ！';
        }
        if (advice.includes('ISO')) {
          return 'ISOを低く保つと、とってもきれいな写真になります。焦らずゆっくり撮ってくださいね。';
        }
        if (advice.includes('三脚')) {
          return '三脚があると安心です。手ブレを気にせず、じっくり構図を考えられますよ。';
        }
        if (advice.includes('ゴールデン')) {
          return 'ゴールデンアワーの光は本当に美しいです。早起きする価値がありますよ！';
        }
        if (advice.includes('ボケ')) {
          return '絞りを開けるだけで、プロみたいなボケ感が出せます。きっと素敵な写真になりますよ！';
        }
        if (advice.includes('目')) {
          return '目にピントを合わせると、生き生きとした表情が撮れます。大丈夫、慣れればすぐできますよ。';
        }
        if (advice.includes('ISOを上げる')) {
          return '暗い場所でもISOを上げれば大丈夫。明るい表情を残せますよ。';
        }
        if (advice.includes('自然光')) {
          return '自然光は最高の味方です。やわらかくて優しい写真が撮れますよ。';
        }
        if (advice.includes('アンダー')) {
          return '少し暗めに撮ると、雰囲気のある写真になります。恐れずチャレンジしてみてください！';
        }
        if (advice.includes('フィルム')) {
          return 'フィルムシミュレーションは楽しいですよ。色々試して、あなたの好きな色を見つけてくださいね。';
        }
        if (advice.includes('コントラスト')) {
          return '光と影を意識すると、写真がぐっと引き締まります。きっとできますよ！';
        }
        if (advice.includes('色温度')) {
          return '色温度を変えるだけで、写真の雰囲気がガラッと変わります。楽しんで試してみてください！';
        }
        return advice.replace(/です|ます/, 'ですよ');
      });

    case 'spartan':
      return baseAdvice.map(advice => {
        if (advice.includes('絞り')) {
          return '絞りはF8〜F11だ！手前から奥まで全部シャープに撮れ！';
        }
        if (advice.includes('ISO')) {
          return 'ISOは100〜400に保て！ノイズなど許されん！';
        }
        if (advice.includes('三脚')) {
          return '三脚を使え！手ブレなど言い訳にするな！';
        }
        if (advice.includes('ゴールデン')) {
          return 'ゴールデンアワーに撮影しろ！プロは光を選ぶ！';
        }
        if (advice.includes('ボケ')) {
          return '絞りを開放しろ！F1.4〜F2.8で背景を溶かせ！';
        }
        if (advice.includes('目')) {
          return '目にピントを合わせろ！それ以外は撮り直しだ！';
        }
        if (advice.includes('ISOを上げる')) {
          return 'ISO400〜1600に上げろ！暗いからと諦めるな！';
        }
        if (advice.includes('自然光')) {
          return '自然光を使え！光を読み、光を制しろ！';
        }
        if (advice.includes('アンダー')) {
          return 'アンダー露出で攻めろ！ドラマを作り出せ！';
        }
        if (advice.includes('フィルム')) {
          return 'フィルムシミュレーションを使いこなせ！個性を出せ！';
        }
        if (advice.includes('コントラスト')) {
          return '光と影を意識しろ！平坦な写真など価値はない！';
        }
        if (advice.includes('色温度')) {
          return '色温度を調整しろ！意図を持って撮影しろ！';
        }
        return advice.replace(/です|ます/, 'だ！').replace(/でき/, '').replace(/なり/, '');
      });

    default:
      return baseAdvice;
  }
};
