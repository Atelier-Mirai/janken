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
let computer = rand(0, 2);

// じゃんけんの勝ち負けの結果を表示する関数
function jankenHandler(event) {
  if (player === GUU) {
    // プレイヤーがグーの時なら
    if (computer === GUU) {
      // コンピュータがグーを出した場合、
      alert("あいこです!");
    } else if (computer === CHOKI) {
      // コンピュータがチョキを出した場合
      alert("あなたの勝ちです!");
    } else {
      // コンピュータがパーを出した場合
      alert("あなたの負けです!");
    }
  } else if (player === CHOKI) {
    // プレイヤーがチョキの時に、
    if (computer === GUU) {
      // コンピュータがグーを出した場合
      alert("あなたの負けです!");
    } else if (computer === CHOKI) {
      // コンピュータがチョキを出した場合
      alert("あいこです!");
    } else {
      // コンピュータがパーを出した場合
      alert("あなたの勝ちです!");
    }
  } else {
    // プレイヤーがパーの時に、
    if (computer === PAA) {
      // コンピュータがグーを出した場合
      alert("あなたの勝ちです!");
    } else if (computer === CHOKI) {
      // コンピュータがチョキを出した場合
      alert("あなたの負けです!");
    } else {
      // コンピュータがパーを出した場合
      alert("あいこです!");
    }
  }
}

// 乱数を返す関数
// rand(0, 2)と呼ぶと 0, 1, 2 と グーチョキパー の乱数を返す
function rand(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
