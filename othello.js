/*=============================================================================
リバーシ 2010-06-11 創作プログラミングの街
http://www.programmingmat.jp/webgame_lib/fjsReversi.html
をもとに改変中
=============================================================================*/

// 位置情報クラス
let othelloPoint = function(){
  this.x = 0;
  this.y = 0;
}

// 候補手クラス
let othelloPutItem = function(){
  this.x = 0;
  this.y = 0;
  this.score = 0;
  this.board = new othelloBoard();
}

// 盤面クラス定義
let othelloBoard = function(){
  // 盤面情報配列作成
  this.cell = new Array();

  console.log(this);

  // 盤面情報配列初期化
  for (let i = 0; i < 8; i++){
    // 二次元配列化
    this.cell[i] = new Array();
    for (let j = 0; j < 8; j++){
      this.cell[i][j] = 0;
    }
  }

  // 盤面コピー
  this.assign = function(arg){
    // 引数の盤面配列をコピー
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        this.cell[j][i] = arg.cell[j][i];
      }
    }
  };

  // 盤面クリア
  this.clear = function(){
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        this.cell[j][i] = 0;
      }
    }
  };

  // 盤面情報配列の指定位置に指定の値を設定
  this.setPiece = function(piece, x, y){
    if (x < 0){ return; }
    if (x > 7){ return; }
    if (y < 0){ return; }
    if (y > 7){ return; }
    if (piece != 1 && piece != -1){ return; }
    this.cell[x][y] = piece;
  };

  // 盤面情報配列の指定位置の値を返す
  this.getPiece = function(x, y){
    if (x < 0){ return; }
    if (x > 7){ return; }
    if (y < 0){ return; }
    if (y > 7){ return; }
    return this.cell[x][y];
  };

  // 空白数を返す
  this.getSpaceNum = function(){
    let n = 0;
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        if (this.getPiece(j, i) == 0){
          n++;
        }
      }
    }
    return n;
  }

  // 黒の数を返す
  this.getBlackNum = function(){
    let n = 0;
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        if (this.getPiece(j, i) == 1){
          n++;
        }
      }
    }
    return n;
  }

  // 白の数を返す
  this.getWhiteNum = function(){
    let n = 0;
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        if (this.getPiece(j, i) == -1){
          n++;
        }
      }
    }
    return n;
  }

  // 指定値の数を返す
  this.getValNum = function(val){
    let n = 0;
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        if (this.getPiece(j, i) == val){
          n++;
        }
      }
    }
    return n;
  }

  // 可能な手の数を数える
  this.getPutNum = function(turn){
    let n = 0;
    // 盤面情報の各セルに配置可能か検証
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        if (this.canPut(turn, j, i)){
          n++;
        }
      }
    }
    return n;
  }

  // 可能な手の位置リストを返す
  this.getPutPointList = function(turn){
    let list = new Array();
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        if (this.canPut(turn, j, i)){
          let item = new othelloPoint();
          item.x = j;
          item.y = i;
          list.push(item);
        }
      }
    }
    return list;
  }

  // 可能な手の位置リストを返す
  this.getPutPutItemList = function(turn, row){
    let list = new Array();
    for (let i = 0; i < 8; i++){
      if (this.canPut(turn, i, row)){
        let item = new othelloPutItem();
        item.x = i;
        item.y = row;
        item.board.assign(this);
        list.push(item);
      }
    }
    return list;
  }

  // 配置
  this.putPiece = function(turn, x, y){
    if (!this.canPut(turn, x, y)){
      return;
    }

    // 周囲8マスから反転処理試行
    for (let i = -1; i <= 1; i++){
      for (let j = -1; j <= 1; j++){
        this.reverse(turn, x, y, j, i);
      }
    }
    this.setPiece(turn, x, y);
  }

  // 指定位置に配置可能か調べる
  this.canPut = function(turn, x, y){
    for (let i = -1; i <= 1; i++){
      for (let j = -1; j <= 1; j++){
        if (this.getReverseNum(turn, x, y, j, i) > 0){
          return true;
        }
      }
    }
    return false;
  }

  // 指定位置から方向指定でいくつ反転可能か調べる
  this.getReverseNum = function(turn, x, y, dx, dy){
    let xx = x + dx;
    let yy = y + dy;
    n = 0;

    if (xx < 0 || xx > 7) { return 0; }
    if (yy < 0 || yy > 7) { return 0; }
    if (dx === 0 && dy === 0) { return 0; }
    if (this.cell[x][y] !== 0) { return 0; }
    if (this.cell[xx][yy] !== -turn) { return 0; }

    while (xx >= 0 && xx < 8 && yy >= 0 && yy < 8 && this.cell[xx][yy] == -turn){
      xx += dx;
      yy += dy;
      n++;
    }

    if (xx >= 0 && xx < 8 && yy >= 0 && yy < 8 && this.cell[xx][yy] == turn){
      return n;
    } else {
      return 0;
    }
  }

  // 指定位置から指定方向に反転処理
  this.reverse = function(turn, x, y, dx, dy){
    let n = this.getReverseNum(turn, x, y, dx, dy);
    if (n < 1){
      return;
    }

    for (let i = 1; i <= n; i++){
      this.setPiece(turn, x + dx * i, y + dy * i);
    }
  }
}

// CPUプレイヤー思考処理用クラス
let othelloCPU = function(level, turn){
  // 思考レベル
  this.level = level;
  this.turn  = turn;

  // 候補手評価作業用盤面
  this.gameBoard = new othelloBoard();

  // CPU処理進行管理変数
  this.processCount  = 0;
  this.processIndex1 = 0;
  this.processIndex2 = 0;
  this.processStage  = 0;

  // 処理結果の決定手
  this.result = null;

  // 作業用保存領域
  this.work = new Array();

  // 処理対象盤面を設定
  this.start = function(board){
    this.gameBoard.assign(board);
    this.processCount  = 0;
    this.processIndex1 = 0;
    this.processIndex2 = 0;
    this.processStage = 0;
    this.result = null;
    this.work = new Array();
  }

  // 思考処理
  this.process = function(){
    let itemList;
    switch (this.processStage){
    // 最初に現在の盤面で可能な手を列挙
    case 0:
      // 作業領域0番に候補手の保存用配列作成
      if (this.processIndex1 == 0 && this.processIndex2 == 0){
        this.work[0] = new Array();
      }

      if (this.gameBoard.canPut(this.turn, this.processIndex1 * 2, this.processIndex2)){
        let item = new othelloPoint();
        item.x = this.processIndex1 * 2;
        item.y = this.processIndex2;
        this.work[0].push(item);
      }
      if (this.gameBoard.canPut(this.turn, 1 + this.processIndex1 * 2, this.processIndex2)){
        let item = new othelloPoint();
        item.x = 1 + this.processIndex1 * 2;
        item.y = this.processIndex2;
        this.work[0].push(item);
      }

      this.processIndex1++;
      if (this.processIndex1 == 4){
        this.processIndex1 = 0;
        this.processIndex2++;
      }

      // 盤面すべてのマスの候補手を検索したら次へ
      if (this.processIndex2 == 8){
        switch (this.level){
        case 0:
          this.processStage = 1;
          break;
        case 1:
        case 2:
          this.processStage = 2;
          break;
        }
      }
      break;

    // Lv0は乱数で手を決定
    case 1:
      // 可能な手の中から乱数で手を決定
      let index = othelloRandom(this.work[0].length);
      this.result = new othelloPoint();
      this.result.x = this.work[0][index].x;
      this.result.y = this.work[0][index].y;
      return true;

    // Lv1/Lv2可能な手を打った盤面作成
    case 2:
      itemList = new Array();
      // 可能な手を打った場合の盤面を作成
      for (let i = 0; i < this.work[0].length; i++){
        itemList[i] = new othelloPutItem();
        itemList[i].x = this.work[0][i].x;
        itemList[i].y = this.work[0][i].y;
        // 現在の盤面をコピー
        itemList[i].board.assign(this.gameBoard);
        // コピーした盤面に候補の手を打つ
        itemList[i].board.putPiece(this.turn, itemList[i].x, itemList[i].y);
      }

      // 候補手リストを作業領域0番に保存
      this.work[0] = itemList;
      switch (this.level){
      case 1:
        this.processIndex1 = 0;
        this.processIndex2 = 0;
        this.processStage  = 3;
        break;

      case 2:
        this.processIndex1 = 0;
        this.processIndex2 = 0;
        this.processStage  = 4;
        break;
      }
      break;

    // Lv1手を決定
    case 3:
      let maxScore = Number.NEGATIVE_INFINITY;
      // 候補手を打った盤面それぞれの得点を算出し、最高点を保存
      for (let i = 0; i < this.work[0].length; i++){
        this.work[0][i].score = othelloGetScore(this.work[0][i].board, this.turn);
        if (this.work[0][i].score > maxScore){
          maxScore = this.work[0][i].score;
        }
      }
      itemList = new Array();

      // 最高点と同位の候補手をリストアップ
      for (let i = 0; i < this.work[0].length; i++){
        if (this.work[0][i].score == maxScore){
          itemList.push(this.work[0][i]);
        }
      }

      console.log(itemList);
      let index3 = rand(itemList.length);
      console.log(index3);

      this.result = new othelloPoint();
      this.result.x = itemList[index3].x;
      this.result.y = itemList[index3].y;
      return true;

    // Lv2
    case 4:
      // 初回処理で作業用領域1番に保存用配列を作成
      if (this.processIndex2 == 0){
        this.work[1] = new Array();
      }

      // 候補手を打った盤面に対する相手の予想手候補を1行ずつ取得
      this.work[1] = this.work[1].concat(this.work[0][this.processIndex1].board.getPutPutItemList(-this.turn, this.processIndex2));
      // 次の行へ
      this.processIndex2++;
      // 盤面すべてで処理を終えたら次へ
      if (this.processIndex2 == 8){
        this.processIndex2 = 0;
        this.processStage  = 5;
      }
      break;

    case 5:
      // 候補手オブジェクトが保持している作業用盤面に相手の予想手を配置
      if (this.work[1].length > 0){
        for (let i = 0; i < this.work[1].length; i++){
          this.work[1][i].board.putPiece(-this.turn, this.work[1][i].x, this.work[1][i].y);
        }
      }
      this.processStage = 6;
      break;

    case 6:
      // 盤面毎の各候補手を評価し（相手から見た）最高評価の手を決定
      if (this.work[1].length > 0){
        let maxScore = Number.NEGATIVE_INFINITY;
        let maxItem = null;
        for (let i = 0; i < this.work[1].length; i++){
          // 評価関数で評価
          this.work[1][i].score = othelloGetScore(this.work[1][i].board, -this.turn);
          // これまでの最高評価なら最高評価候補に
          if (this.work[1][i].score > maxScore){
            maxScore = this.work[1][i].score;
            maxItem = this.work[1][i];
          }
        }
        // 相手の最高評価の手を、自分側の評価関数で評価し保存
        this.work[0][this.processIndex1].score = othelloGetScore(maxItem.board, this.turn);
      } else { // 相手はパス
        this.work[0][this.processIndex1].score = othelloGetScore(this.work[0][this.processIndex1].board, this.turn);
      }

      // 候補手すべての処理を終えたら、最高得点の候補手から手を決定
      if (this.processIndex1 == this.work[0].length - 1){
        this.processStage = 7;
      } else {
        this.processStage = 4;
        this.processIndex1++;
        return false;
      }
      break;

    case 7:
      let maxScore7 = Number.NEGATIVE_INFINITY;
      // 候補手の得点算出＆最高得点を記録
      for (let i = 0; i < this.work[0].length; i++){
        if (this.work[0][i].score > maxScore7){
          maxScore7 = this.work[0][i].score;
        }
      }
      itemList = new Array();

      // 最高得点と同位の手をリストアップ
      for (let i = 0; i < this.work[0].length; i++){
        if (this.work[0][i].score == maxScore7){
          itemList.push(this.work[0][i]);
        }
      }

      // 最高得点の候補手の中から乱数で手を決定
      let index7 = rand(itemList.length);
      this.result = new othelloPoint();
      this.result.x = itemList[index7].x;
      this.result.y = itemList[index7].y;

      // trueを返して処理終了を通知
      return true;
      break;
    }

    this.processCount++;
    return false;
  }
}

// 0 から max-1 までの乱数を返す
function rand(max){
  return Math.floor(Math.random() * max);
}

// ゲーム開始前:0
// ゲーム人間手番中:1
// ゲームCPU手番中:2
// ゲーム手番後ウエイト中:3
// ゲームパス表示中:7
// ゲーム終了表示中:9
// ゲーム結果表示中:10
let gameState;

// 現在、あるいは勝利プレイヤー
let gameTurn;

// 黒-人間:1
// 黒-CPU Lv0:2
// 黒-CPU Lv1:3
// 白-人間:-1
// 白-CPU Lv0:-2
// 白-CPU Lv1:-3
let gamePlayer;
let othelloBlackPlayer;
let othelloWhitePlayer;
let othelloBlackCPU;
let othelloWhiteCPU;
let othelloBlackNum;
let othelloWhiteNum;

// 盤面情報
let gameBoard = new othelloBoard();

// 盤面マス目状態配列
let cellState = new Array();

for (othelloTmp = 0; othelloTmp < 8; othelloTmp++){
  cellState[othelloTmp] = new Array();
}

// カーソル変更スタイルシート用文字列
let cellCursor = 'hand';

// 実行環境がFirefoxなら「pointer」に
// if (navigator.userAgent.indexOf("Firefox") > 0){
//   cellCursor = 'pointer';
// }
let othelloTimerID = 0;
othelloInit();

// 初期化
function othelloInit(){
  // othelloWriteHTML();
  // othelloSetStyle();
  othelloReset();
  othelloDraw();
}

// ゲームリセット
function othelloReset(){
  gameBoard.clear();
  // 初期配置
  gameBoard.setPiece(-1, 3, 3);
  gameBoard.setPiece(1, 4, 3);
  gameBoard.setPiece(1, 3, 4);
  gameBoard.setPiece(-1, 4, 4);
  othelloBlackNum = gameBoard.getBlackNum();
  othelloWhiteNum = gameBoard.getWhiteNum();
}

// 開始ボタンクリック時
function othelloStartClick(){
  // 無条件にタイマーリセット
  clearTimeout(othelloTimerID);
  // ゲーム初期化
  othelloReset();
  // 黒プレイヤーの設定取得
  let blackPlayer = 0;

  controlPanel = document.getElementById("controlPanel")
  blackPlayer = parseInt(controlPanel.elements.blackMenu.value);
  console.log(blackPlayer);

  if (blackPlayer === 0){
    return;
  }

  if (blackPlayer === 1){ // 人間
    othelloBlackPlayer = 0;
  } else { // CPU
    othelloBlackPlayer = 1;
    othelloBlackCPU = new othelloCPU(blackPlayer - 1, 1);
  }

  // 白プレイヤーの設定取得
  whitePlayer = parseInt(controlPanel.elements.whiteMenu.value);
  console.log(whitePlayer);

  if (whitePlayer === 0){
    return;
  }

  if (whitePlayer === 1){ // 人間
    othelloWhitePlayer = 0;
  } else { // CPU
    othelloWhitePlayer = 1;
    othelloWhiteCPU = new othelloCPU(whitePlayer - 1, -1);
  }

  // 黒の手番
  othelloSetTurn(1);
  othelloDraw();
}

// マス目クリック時
function cellClick(x, y){
  // 人間の手番なら、配置処理
  if (gameState === 1){
    if (gameBoard.canPut(gameTurn, x, y)){
      gameBoard.putPiece(gameTurn, x, y);
      othelloDraw();
      othelloEndTurn(gameTurn);
    }
  }
}

// 手番開始
function othelloSetTurn(turn){
  gameTurn = turn;
  // パス判定
  if (gameBoard.getPutNum(turn) == 0){
    gameState = 7;
    othelloDraw();
    // othelloTimerID = setTimeout("othelloSetTurn(" + new String(-turn) + ")", 1000);
    othelloTimerID = setTimeout(othelloSetTurn(-turn), 1000);
    return;
  }

  switch (turn){
  // 黒の番
  case 1:
    switch (othelloBlackPlayer){
    // 人間
    case 0:
      gameState = 1;
      gamePlayer = 1;
      othelloDraw();
      break;

    // CPU
    case 1:
      gameState  = 2;
      gamePlayer = 2;
      othelloDraw();
      // CPUに現在の盤面を設定
      othelloBlackCPU.start(gameBoard);
      // CPU思考処理開始
      othelloCPUProcess(turn);
      break;
    }
    break;

  // 白の番
  case -1:
    switch (othelloWhitePlayer){
    // 人間
    case 0:
      gameState  = 1;
      gamePlayer = -1;
      othelloDraw();
      break;

    // CPU
    case 1:
      gameState  = 2;
      gamePlayer = -2;
      othelloDraw();
      // CPUに現在の盤面を設定
      othelloWhiteCPU.start(gameBoard);
      // CPU思考処理開始
      othelloCPUProcess(turn);
      break;
    }
    break;
  }

  // 各マスのスタイル情報設定
  othelloSetCellState(gamePlayer);
  othelloSetCellStyle();
}

// 手番終了処理
function othelloEndTurn(turn){
  othelloBlackNum = gameBoard.getBlackNum();
  othelloWhiteNum = gameBoard.getWhiteNum();
  // 盤面に空きがなければ、ゲーム終了
  if (gameBoard.getSpaceNum() == 0){
    gameOver(0);
    return;
  }

  // 双方パスならゲーム終了
  if (gameBoard.getPutNum(turn) == 0 && gameBoard.getPutNum(-turn) == 0){
    gameOver(1);
    return;
  }

  // 次の手番開始
  othelloSetTurn(-turn);
  othelloDraw();
}

// CPU思考中
function othelloCPUProcess(turn){
  // ウエイト軽減のため複数回まとめて実行
  for (let i = 0; i < 3; i++){
    switch (turn){
    case 1:
      // CPU思考処理が終わったら、ウエイト後に配置処理へ
      if (othelloBlackCPU.process()){
        othelloTimerID = setTimeout(othelloCPUPut(othelloBlackCPU), 20);
        return;
      }
      break;

    case -1:
      // CPU思考処理が終わったら、ウエイト後に配置処理へ
      if (othelloWhiteCPU.process()){
        othelloTimerID = setTimeout(othelloCPUPut(othelloWhiteCPU), 20);
        return;
      }
      break;
    }
  }

  // 思考処理継続中なら、一度制御を返した後に再び呼び出す
  // othelloTimerID = setTimeout("othelloCPUProcess(" + new String(turn) + ")", 10);
  othelloTimerID = setTimeout(othelloCPUProcess(turn), 10);
}

// CPU配置
function othelloCPUPut(cpu){
  // 思考処理で決定した場所に配置
  gameBoard.putPiece(cpu.turn, cpu.result.x, cpu.result.y);
  othelloDraw();
  othelloEndTurn(cpu.turn);
}

// ゲーム終了処理
function gameOver(mode){
  switch (mode){
  // 「ゲーム終了」メッセージ表示状態
  case 0:
  case 1:
    gameState = 9;
    othelloDraw();
    // 判定結果表示へ
    // othelloTimerID = setTimeout("gameOver(2)", 1000);
    othelloTimerID = setTimeout(gameOver(2), 1000);
    break;

  // 判定と結果表示
  case 2:
    gameState = 10;
    blackNum = gameBoard.getBlackNum();
    whiteNum = gameBoard.getWhiteNum();

    // 引き分け
    if (blackNum === whiteNum){ gameTurn = 0; }
    // 黒の勝ち
    if (blackNum > whiteNum){ gameTurn = 1; }
    // 白の勝ち
    if (blackNum < whiteNum){ gameTurn = -1; }
    othelloDraw();
    break;
  }
}

// 描画処理
function othelloDraw(){
  // メッセージ領域の参照取得
  // 状況に応じてメッセージ表示
  switch (gameState){
  // ゲーム手番中
  case 1:
  case 2:
    if (gameTurn ===  1){ notification("黒の番"); }
    if (gameTurn === -1){ notification("白の番"); }
    break;

  // パス中
  case 7:
    if (gameTurn ===  1){ notification("黒はパス"); }
    if (gameTurn === -1){ notification("白はパス"); }
    break;

  case 9:
    notification("ゲーム終了");
    break;

  case 10:
    switch (gameTurn){
    case 0:
      notification("引き分け");
      break;

    case 1:
      notification("黒の勝ち");
      break;
    case -1:
      notification("白の勝ち");
      break;
    }
    break;
  }

  // 黒と白の数を表示

  document.getElementById('blackNumDisp').innerHTML = othelloBlackNum;
  document.getElementById('whiteNumDisp').innerHTML = othelloWhiteNum;

  // マス目表示
  for (let i = 0; i < 8; i++){
    for (let j = 0; j < 8; j++){
      id  = `cell${j}${i}`
      elm = document.getElementById(id);
      switch (gameBoard.getPiece(j, i)){
      case 1:
        elm.style.color = 'black';
        elm.innerHTML = '●';
        break;

      case -1:
        elm.style.color = 'white';
        elm.innerHTML = '●';
        break;
      default:
        elm.innerHTML = '';
        break;
      }
    }
  }
}

function othelloSetCellState(player){
  for (let i = 0; i < 8; i++){
    for (let j = 0; j < 8; j++){
      switch (gameBoard.getPiece(j, i)){
      // 空き
      case 0:
        // プレイヤーが人間で、配置可能なら2に
        if ((player === 1 || player === -1) && gameBoard.canPut(player, j, i)){
          cellState[j][i] = 2;
        } else {
          cellState[j][i] = 0;
        }
        break;

      case -1:
      case 1:
        cellState[j][i] = gameBoard.getPiece(j, i);
        break;
      }
    }
  }
}

// マス目のスタイル設定
function othelloSetCellStyle(){
  for (let i = 0; i < 8; i++){
    for (let j = 0; j < 8; j++){
      let id  = `cell${j}${i}`;
      let elm = document.getElementById(id);

      switch (cellState[j][i]){
      // マス状態が2（配置可能）なら、カーソルをポインタに
      case 2:
        elm.style.cursor = cellCursor;
        break;
      default:
        elm.style.cursor = 'default';
        break;
      }
    }
  }
}

// 盤面評価関数
function othelloGetScore(gameBoard, turn){
  let score = 0;
  // 可能な指し手の数を評価
  score += gameBoard.getPutNum(turn) * 4;

  // 後半では盤面上の石の数も評価
  if (gameBoard.getSpaceNum() < 30){
    score += gameBoard.getValNum(turn) * 2;
  }

  let board = gameBoard.cell;

  // 四隅の処理
  if (board[0][0] === -turn){ score -= 100; }
  if (board[0][0] === turn){
    score += 150;
    i = 1;
    while (board[i][0] === turn && i++ < 7){
      score += 4;
    }
    i = 1;
    while (board[0][i] === turn && i++ < 7){
      score += 4;
    }
  } else {
    if (board[1][0] === turn){ score -= 40; }
    if (board[0][1] === turn){ score -= 40; }
    if (board[1][1] === turn){ score -= 40; }
  }
  if (board[7][0] === -turn){ score -= 100; }
  if (board[7][0] === turn){
    score += 150;
    i = 1;
    while (board[7][i] === turn && i++ < 7){
      score += 4;
    }
    i = 1;
    while (board[7 - i][0] === turn && i++ < 7){
      score += 4;
    }
  } else {
    if (board[6][0] === turn){ score -= 40; }
    if (board[7][1] === turn){ score -= 40; }
    if (board[6][1] === turn){ score -= 40; }
  }
  if (board[7][7] === -turn){ score -= 100; }
  if (board[7][7] === turn){  score += 150;
    i = 1;
    while (board[7-i][7] === turn && i++ < 7){
      score += 4;
    }
    i = 1;
    while (board[7][7-i] === turn && i++ < 7){
      score += 4;
    }
  } else {
    if (board[6][7] === turn){ score -= 40; }
    if (board[7][6] === turn){ score -= 40; }
    if (board[6][6] === turn){ score -= 40; }
  }
  if (board[0][7] === -turn){ score -= 100; }
  if (board[0][7] === turn){
    score += 150;
    i = 1;
    while (board[i][7] === turn && i++ < 7){
      score += 4;
    }
    i = 1;
    while (board[0][7-i] === turn && i++ < 7){
      score += 4;
    }
  } else {
    if (board[1][7] === turn){ score -= 40; }
    if (board[0][6] === turn){ score -= 40; }
    if (board[1][6] === turn){ score -= 40; }
  }
  return score;
}

/* 渡されたメッセージを通知領域に表示する関数
-------------------------------------------------------------------------*/
function notification(message){
  document.getElementById('notification').innerHTML = message;
}
