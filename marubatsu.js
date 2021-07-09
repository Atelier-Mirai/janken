/*=============================================================================
 * ○×ゲーム

 * jQueryプラグイン「インチキ三目並べ」
 * https://language-and-engineering.hatenablog.jp/
 * entry/20121204/jQueryFakeTicTacToeJs をもとに改変
=============================================================================*/

/* 定数宣言
--------------------------------------------------------------------------*/
const PLAYER   = +1;
const COMPUTER = -1;

const DRAW     = 0;
const LOSE     = 1;
const WIN      = 2;

/* グローバル変数宣言
--------------------------------------------------------------------------*/
let turn       = PLAYER;
// マスの状態をYX座標として管理
// board[Y][X];
let board = [
  //  X = 0  1  2
         [0, 0, 0], // Y = 0
         [0, 0, 0], // Y = 1
         [0, 0, 0]  // Y = 2
       ];

/* セットアップ関数
-------------------------------------------------------------------------*/
function setup() {
  // 押下イベントをセット
  for (let y = 0; y <= 2; y++){
    for(let x = 0; x <= 2; x++){
      let td = document.getElementById(`y${y}_x${x}`);
      td.addEventListener('click', function(){
        putCircle(y, x);
      });
    }
  }
}

/* もう一度、対局するときには、盤面の状態を初期化する
-------------------------------------------------------------------------*/
function replay(){
  for (let y = 0; y <= 2; y++){
    for(let x = 0; x <= 2; x++){
      let td = document.getElementById(`y${y}_x${x}`);
      td.innerHTML = "";
    }
  }
  turn = PLAYER;
  board = [
    //  X = 0  1  2
           [0, 0, 0], // Y = 0
           [0, 0, 0], // Y = 1
           [0, 0, 0]  // Y = 2
         ];

  notification("あなたの番です。");
}

/* × を書く関数
-------------------------------------------------------------------------*/
function putCross(y, x){
  if (isBlankCell(y, x)){
  // 空いている升目なら×を書く
    let td = document.getElementById(`y${y}_x${x}`);
    td.innerHTML = "×";
    board[y][x]  = -1;

    // 勝利者確認
    let winner = checkWinner();
    console.log(winner);
    if (winner === PLAYER){
      notification("あなたの勝ちです。");
      document.getElementById('play').innerText = "もう一度";

      // replay();
      return;
    } else if (winner === COMPUTER){
      notification("コンピュータの勝ちです。");
      document.getElementById('play').innerText = "もう一度";

      // replay();
      return;
    }

    // 相手の手番にする
    changeTurn();
    notification("あなたの番です。");
  }
}

/* y, x の升目に ○ または × を置く
 * 併せて、勝者判定を行う
-------------------------------------------------------------------------*/
function putCircle(y, x){
  if (!isBlankCell(y, x)){ return; }

  // 空いている升目なら○を書く
  let td = document.getElementById(`y${y}_x${x}`);
  td.innerHTML = "○";
  board[y][x]  = 1;

  // 勝利者確認
  let winner = checkWinner();
  if (winner === PLAYER){
    notification("あなたの勝ちです。");
    document.getElementById('play').innerText = "もう一度";

    // replay();
    return;
  } else if (winner === COMPUTER){
    notification("コンピュータの勝ちです。");

    document.getElementById('play').innerText = "もう一度";
    // replay();
    return;
  }

  // 相手の手番にする
  changeTurn();
  notification("コンピュータの番です。");
  setTimeout(execBestStrategy, 2000);
}

/* コンピュータのベストの戦略を実行する関数
 * 1. 自分が３つ並ぶならそうする
 * 2. 相手が３つ並ぶなら妨害する
 * 3. できれば中央に置く
 * 4. できればどこか隅に置く
 * 5. どこでもいいので空いている升目に置く
 ------------------------------------------------------------------------*/
function execBestStrategy(){
  // 1. 自分が３つ並ぶならそうする
  info = getReachInfo(COMPUTER);
  // getReachInfoの返り値：
  // return { isReach: isReach, blankCellY: blankCellY, blankCellX: blankCellX }
  if(info.isReach){
    putCross(info.blankCellY, info.blankCellX);
    return;
  }

  // 2. 相手が３つ並ぶなら妨害する
  info = getReachInfo(PLAYER);
  if(info.isReach){
    putCross(info.blankCellY, info.blankCellX);
    changeTurn(); // 相手の手番にする
    return;
  }

  // 3. できれば中央に置く
  if (isBlankCell(1, 1)){
    putCross(1, 1);
    changeTurn(); // 相手の手番にする
    return;
  }

  // 4. できればどこか隅に置く
  if (isBlankCell(0, 0)){
    putCross(0, 0);
    changeTurn();
    return;
  }
  if (isBlankCell(0, 2)){
    putCross(0, 2);
    changeTurn();
    return;
  }
  if (isBlankCell(2, 0)){
    putCross(2, 0);
    changeTurn();
    return;
  }
  if (isBlankCell(2, 2)){
    putCross(2, 2);
    changeTurn();
    return;
  }

  // 5. どこでもいいので空いている升目に置く
  for (let y = 0; y <= 2; y++){
    for(let x = 0; x <= 2; x++){
      if (isBlankCell(y, x)){
        putCross(y, x);
        changeTurn();
        return;
      }
    }
  }

  // 空いている升目がなければ、ゲーム終了
  if (isGameEnd()){
    notification('ゲーム終了。引き分けです。');
    // replay();
  }
}

/* 空の升なら true を返す
-------------------------------------------------------------------------*/
function isBlankCell(y, x){
  return (board[y][x] === 0);
}

/* 渡されたメッセージを通知領域に表示する関数
-------------------------------------------------------------------------*/
function notification(message){
  document.getElementById('notification').innerHTML = message;
}

/* 調査対象者(プレイヤー又はコンピュータ)がリーチ状態にあるかを返す
 * board = [
 * //  X = 0  1  2
 *         [1, 1, 0], // Y = 0  横一列でプレイヤーがリーチ
 *         [0, 0, 0], // Y = 1
 *         [0, 0, 0]  // Y = 2
 *        ];
 * surveyed_player が PLAYER なら、プレイヤーがリーチ状態かを調べる
 * surveyed_player が COMPUTER なら、コンピュータがリーチ状態かを調べる
 * { isReach: true, blankCellY: 0, blankCellX: 2 } を返す
-------------------------------------------------------------------------*/
function getReachInfo(surveyed_player){
  // 関数内で使う変数の宣言
  let isReach = false;     // リーチではない
  let blankCellY;          // リーチだった時に、空いている升目の
  let blankCellX;          // Y 座標と X 座標を入れて返す

  // 横方向に検査
  // if (board[0][0] + board[0][1] + board[0][2] === 2) { // 0 行目がリーチ }
  for(y = 0; y <= 2; y++){
    if (board[y][0] + board[y][1] + board[y][2] === (surveyed_player) * 2){
      isReach = true;
      if (board[y][0] === 0){ blankCellY = y; blankCellX = 0; }
      if (board[y][1] === 0){ blankCellY = y; blankCellX = 1; }
      if (board[y][2] === 0){ blankCellY = y; blankCellX = 2; }
    }
  }

  // 縦方向に検査
  for(x = 0; x <= 2; x++){
    if (board[0][x] + board[1][x] + board[2][x] === (surveyed_player) * 2){
      isReach = true;
      if (board[0][x] === 0){ blankCellY = 0; blankCellX = x; }
      if (board[1][x] === 0){ blankCellY = 1; blankCellX = x; }
      if (board[2][x] === 0){ blankCellY = 2; blankCellX = x; }
    }
  }

  // 斜め下方向に検査
  if (board[0][0] + board[1][1] + board[2][2] === (surveyed_player) * 2){
    isReach = true;
    if (board[0][0] === 0){ blankCellY = 0; blankCellX = 1; }
    if (board[1][1] === 0){ blankCellY = 1; blankCellX = 1; }
    if (board[2][2] === 0){ blankCellY = 2; blankCellX = 2; }
  }

  // 斜め上方向に検査
  if (board[2][0] + board[1][1] + board[0][2] === (surveyed_player) * 2){
    isReach = true;
    if (board[2][0] === 0){ blankCellY = 2; blankCellX = 0; }
    if (board[1][1] === 0){ blankCellY = 1; blankCellX = 1; }
    if (board[0][2] === 0){ blankCellY = 0; blankCellX = 2; }
  }

  // （擬似）連想配列形式で結果を返す
  return { isReach: isReach, blankCellY: blankCellY, blankCellX: blankCellX }
}

// 縦・横・斜めで、三つ並んでいるか検査して、勝者を返す
function checkWinner(){
  let winner = DRAW; // 引き分け

  // 横方向に検査
  // if (board[0][0] + board[0][1] + board[0][2] === +3) // 0 行目が並んでいる
  for(y = 0; y <= 2; y++){
    if (board[y][0] + board[y][1] + board[y][2] === +3){ winner = PLAYER; }
    if (board[y][0] + board[y][1] + board[y][2] === -3){ winner = COMPUTER; }
  }

  // 縦方向に検査
  for(x = 0; x <= 2; x++){
    if (board[0][x] + board[1][x] + board[2][x] === +3){ winner = PLAYER; }
    if (board[0][x] + board[1][x] + board[2][x] === -3){ winner = COMPUTER; }
  }

  // 斜め下方向に検査
  if (board[0][0] + board[1][1] + board[2][2] === +3){ winner = PLAYER; }
  if (board[0][0] + board[1][1] + board[2][2] === -3){ winner = COMPUTER; }

  // 斜め上方向に検査
  if (board[2][0] + board[1][1] + board[0][2] === +3){ winner = PLAYER; }
  if (board[2][0] + board[1][1] + board[0][2] === -3){ winner = COMPUTER; }

  // 勝者を返す
  return winner;
}

/* ゲーム終了ならtrueを返す
-------------------------------------------------------------------------*/
function isGameEnd(){
  for (let y = 0; y <= 2; y++){
    for(let x = 0; x <= 2; x++){
      if (isBlankCell(y, x)){
        // 空いている升目があればfalseを返す
        return false;
      }
    }
  }
  // 空いている升目がなかったので、ゲーム終了なので、trueを返す
  return true;
}

/* 手番を交代する
-------------------------------------------------------------------------*/
function changeTurn(){
  turn *= -1;
}

/*-----------------------------------------------------------------------------
 * メイン処理
-----------------------------------------------------------------------------*/

// 盤面準備
setup();

// 開始ボタンにイベントリスナセット
document.getElementById('play').addEventListener('click', replay);
