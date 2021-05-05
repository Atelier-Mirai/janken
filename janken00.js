/*=============================================================================
  じゃんけんプログラム
  https://qiita.com/tsuyopon_xyz/items/ed2e244da8225eb31b68 をもとに改変
=============================================================================*/

/*-----------------------------------------------------------------------------
 先頭に「'use strict';」と書くことで、潜在的なバグを減らす。
-----------------------------------------------------------------------------*/
'use strict';

/*-----------------------------------------------------------------------------
  イベントリスナの設定
-----------------------------------------------------------------------------*/
const playButton  = document.getElementById("play");
playButton.addEventListener('click', jankenHandler);

/*-----------------------------------------------------------------------------
  じゃんけんの勝ち負けの結果を表示する関数
-----------------------------------------------------------------------------*/
function jankenHandler(event) {
  alert("あなたの勝ちです!");
}
