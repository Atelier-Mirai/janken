// 潜在的なバグを減らす。
'use strict';

// 定数宣言
// プログラム内で共通して使える定数を宣言する。
// 慣習的に定数名は全て大文字で書かれる。
const DRAW  = 0; // あいこ
const LOSE  = 1; // 負け
const WIN   = 2; // 勝ち

const GUU   = 0; // グー
const CHOKI = 1; // チョキ
const PAA   = 2; // パー

// イベントリスナの設定
// 開始ボタンを押されるとゲーム開始
const playButton  = document.getElementById("play");
playButton.addEventListener('click', jankenHandler);

// メイン処理
// player の手を取得
const jankenInputBox = document.getElementById("janken_number");
let player = parseInt(jankenInputBox.value);

// conputer の手を 乱数で設定
let computer = Math.floor(Math.random()*3);

// じゃんけんの勝ち負けの結果を表示する関数
function jankenHandler(event) {
  // judge は、
  // プレイヤーとコンピュータの手を与えると、
  // 勝敗を返す関数です。
  // 相子なら0 , 負けなら1, 勝ちなら2が返ります。
  const result = judge(player, computer);

  if (result === DRAW) {
    // resultと DRAW が等しかった時に、行いたい処理を記述します。
    // 本来であれば、result === 1 と書かなければなりませんが、
    // 一番上で定数の宣言をしているので、
    // result === DRAW と書け、人に分かりやすいです。
    // ここでは、「引き分けです」とアラートを表示します。
    alert('引き分けです!');
  } else if (result === LOSE) {
    // else はそうでなければ、という意味です。
    // DRAW と等しくなかった時に、LOSE と等しいか、調べています。
    // そして、LOSE と等しかったら、「負け」と表示します。
    alert('あなたの負けです!');
  } else {
    // else は他のいずれにも該当しなかった際の処理を記します。
    // 引き分けでも負けでもない、つまり「勝ち」と表示します。
    alert('あなたの勝ちです!');
  }
}

// プレイヤーの手とコンピュータの手が与えられると、
// 0: 引き分け 1: 負け 2: 勝ち を返す関数
// 参考 https://staku.designbits.jp/check-janken/
function judge(player, computer) {
  return (player - computer + 3) % 3;
}
