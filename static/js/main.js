/**
 * **** **** **** **** **** **** **** ****
 * 定数
 * **** **** **** **** **** **** **** ****
 */
//INTERVAL = 32;          // 30FPS（1フレームを32ms間隔で処理）
 
CELL_SIZE = 128;        // セルサイズ
 
// ステージの位置
STAGE_LEFT = 64;
STAGE_TOP = 80;
STAGE_WIDTH = 1280;
STAGE_HEIGHT = 720;
/**
 * **** **** **** **** **** **** **** ****
 * クラス
 * **** **** **** **** **** **** **** ****
 */

/**
 * **** **** **** **** **** **** **** ****
 * グローバル変数
 * **** **** **** **** **** **** **** ****
 */
let interval = 32;  //インターバルを変数で定義に変更
let canvas = null;              // キャンバス
let context = null;             // 描画用コンテキスト
let titleImage = null;          // タイトル画像Imageオブジェクト
let backgroundImage = null;     // 背景画像Imageオブジェクト
let playerCharacterImage = null;//プレイヤーのキャラクター画像Imageオブジェクト
let cupCharacterImage = null;   //CPUのキャラクター画像Imageオブジェクト
let fillStyleColor = null;      //マップの描写のカラー
let matchingImage = null;       //マッチング画面の画像オブジェクト

// フラグ
let phase = -1;                 // ゲームフェーズフラグ {0: タイトルフェーズ, 1: マッチングフェーズ, 2: カウントダウンフェーズ, 3:タイピングフェーズ, 4: 結果フェーズ}
let isTitleGuide = true;        // タイトルガイド点滅用フラグ {true: 表示, false: 非表示}

// 時間制御用の最終取得時刻
let lastTitleTime = -1;         // タイトルガイド表示切替用
let lastCountDownTime = -1;     // カウントダウン表示用
let lastPutTime = -1;           // 配置用
let lastReducedTime = -1;       // 残り時間更新用
let lastTimeUpTime = -1;        // タイムアップ表示用
let lastmatchingTime = -1;      //マッチング画面表示用

// ゲームデータ
let map = null;                 // マップデータ
let count = -1;                 // カウントダウン用の残りカウント
let remainingTime = -1;         // 残り時間
let score = 0;                  // スコア
let highScore = 0;              // ハイスコア
let touchCount = 0;             //タッチの回数を数えるカウント
let exa = 0;                //1回実行すると1になる。クリックで0に戻る。
let gamecellcount = 0;
let player_rate = 2000;            //初期レート
let cpuRate = 0;
let userWinningStreak = 0;
let cpuWinningStreak = 0;
let player_name = null;
let player_win = null;          //プレイヤーの勝敗　勝ち：１　負け：ー１
let dakenbyo = null;
let loseFlagArray = new Array(10).fill(false);   //相手の方がタイピング速度が早いとき
let myScore = 0;
let opponentScore = 0;
let typingSpeed = null; // 対戦相手のタイピング速度（文字/分）
/**
 * **** **** **** **** **** **** **** ****
 * 初期化処理
 * **** **** **** **** **** **** **** ****
 */
/**
 * ページ読込み
 */
$(function() {
    // 全体の初期化処理
    init();
    player_name = window.prompt("あなたの名前を入力してください。");    //プレイヤーの名前をplayer_nameへ書き込み
    getRate();
    // メインループの開始
    runMainLoop();      // 追加
});
/**
 * 全体の初期化処理
 */
function init() {
    // キャンバス要素の取得
    canvas = $('#main_canvas').get(0);
    // 描画コンテキストの取得
    context = canvas.getContext("2d");

    // イベントリスナの追加
    canvas.addEventListener('click', onCanvasClick, false);     // 追加
    // Imageオブジェクトの生成
    titleImage = new Image();
    titleImage.src = titleSrc;
    titleImage.onload = function() {
        console.log(titleImage.src + " : ロード完了");
        drawTitle();
    }
 
    backgroundImage = new Image();
    backgroundImage.src = backgroundSrc;
    backgroundImage.onload = function() {
        console.log(backgroundImage.src + " : ロード完了");
    }

    matchingImage = new Image();
    matchingImage.src = matchingImageSrc;
    matchingImage.onload = function() {
        console.log(matchingImage.src + " : ロード完了");
    }

    //プレイヤーImageオブジェクト作成
    playerCharacterImage = new Image();
    playerCharacterImage.src = characterSrc[0];
    playerCharacterImage.onload = function() {
        console.log(playerCharacterImage.src + " : ロード完了");
    }
    //CPUImageオブジェクト作成
    cpuCharacterImage = new Image();

    
    //ゲームデータのリセット
    resetData();           // 追加
}
/**
 * **** **** **** **** **** **** **** ****
 * メイン
 * **** **** **** **** **** **** **** ****
 */
/**
 * メインループの開始
 */
function runMainLoop() {
    // ゲームフェーズをタイトルフェーズに移行する。
    phase = 0;
 
    // メインループを開始する。
    setTimeout(mainLoop, 0);
    lastTitleTime = Date.now();
}
/**
 * メインループ
 */
function mainLoop() {
    let mainLoopTimer = setTimeout(mainLoop, interval);
    let now = -1;
 
    switch (phase) {
    case 0:
        // タイトルフェーズ(りゅうや担当)
        now = Date.now();
        if (now - lastTitleTime >= 500) {
            // 0.5秒に1回のタイミングでタイトルガイドを点滅させる。
            lastTitleTime = Date.now();
            isTitleGuide = !isTitleGuide;
        }
        someFunctionInMainJS();
        drawScore();
        drawHighScore();
        drawplayername(player_name);
        break;
    case 1:
        // 対戦相手マッチングフェーズ(しんさく担当)
        now = Date.now();
        //5秒間マッチング画面を表示する。
        if (now - lastmatchingTime >= 5000) {
            lastCountDownTime = Date.now();
            phase = 2;
        }
        drawmatchingScreen();
        drawCharacter();
        drawmatchingdata();
        break;
    case 2:
        //カウントダウンフェーズ(ももいちゃん担当)
        now = Date.now();
        if (now - lastCountDownTime >= 1000) {
            // 1秒に1回カウントダウンする。
            lastCountDownTime = Date.now();
            if (--count < 0) {
                // カウントダウンが終了したらタッチフェーズに移行する。
                interval = 210000;
                phase = 3;
                //put();
                lastPutTime = Date.now();
                lastReducedTime = Date.now();
            }
        }
        drawScoreBall();
        drawBackground();
        //drawScore();
        //drawHighScore();
        //drawmeter();
        drawCount();
        //drawRemainingTime();
        //drawTouchCount();
        drawMatchCharacter();
        drawRate();
        
        break;
    case 3:                 // 以下を追加
        // タイピング対戦フェーズ(ももいちゃん担当)
        now = Date.now();
        //drawInputOutline();
        context.clearRect(0,0,1280,720);

        // 入力されたセンテンスと現在のセンテンスを比較し、正確性に基づいてスタイルを変更
        // 正確に入力された場合、次のセンテンスを表示
        // ゲームが終了した場合は結果表示
        inputSentence.addEventListener('input', function () {
        const typedSentence = inputSentence.textContent;
        const currentSentence = sentences[currentSentenceIndex];
        //let loseFlag = false;
        //sentence1の色変更
        for (let i = 0; i < typedSentence.length; i++) {
            const span1 = sentenceContainer1.childNodes[i];
        
            if (typedSentence[i] === currentSentence[i]) {
            span1.classList.remove('highlight');
            span1.classList.add('typed');
            } else {
            span1.classList.add('highlight');
            span1.classList.remove('typed');
            } 
        }
        //if (typedSentence === currentSentence || loseFlag === true) {
        if (typedSentence === currentSentence) {
            currentSentenceIndex++;    
            myScore++;           
            if (currentSentenceIndex < sentences.length) {
            //loseFlag = false;
            
            inputSentence.innerHTML = '';
            renderSentence();
            renderOpponentSentence(); // 次のお題表示
            drawBlueBall();
            
            } else {
            endGame();
            interval = 32;
            phase = 4;
            lastPutTime = Date.now();
            lastReducedTime = Date.now();
            mainLoop();
            }
        }
        
        if (loseFlagArray[currentSentenceIndex] === true) {
            currentSentenceIndex++; 
            opponentScore++;               
            if (currentSentenceIndex < sentences.length) {
            //loseFlag = false;
            inputSentence.innerHTML = '';
            renderSentence();
            renderOpponentSentence(); // 次のお題表示
            drawRedBall();
            } else {
            endGame();
            interval = 32;
            phase = 4;
            lastPutTime = Date.now();
            lastReducedTime = Date.now();
            mainLoop();
            }
        }
        });

        startGame();
        //drawBackground();
        //drawSentenceContainer1();
        //drawSentenceContainer2();

        drawScoreBall();
        drawInputLine();
        drawSentenceOutline(20,20,STAGE_WIDTH - 40,100);
        drawSentenceOutline(20,STAGE_HEIGHT - 150,STAGE_WIDTH - 40,100);
        drawMatchCharacter();
        drawRate();
        drawMap();
        //drawmeter();
        //drawRemainingTime();
        //drawTouchCount();
        break;
    case 4:     // 以下を追加
        // 結果画面フェーズ(しんさく担当)
        now = Date.now();
        sentenceContainer1.innerHTML = '';
        sentenceContainer2.innerHTML = '';
        inputSentence.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            loseFlagArray[i] = false;
          }
        if (now - lastTitleTime >= 500) {
            // 0.5秒に1回のタイミングで　　タイトルガイドを点滅させる。
            lastTitleTime = Date.now();
            isTitleGuide = !isTitleGuide;
        }
        drawTitle("再マッチング");      //ちかちか、背景の表示
        drawresult();

        break;
    }
}
//タイピングフェーズ（後藤追記）--------------------------------------------------------------
const sentences = [
    "こんにちは、タイピングゲームを楽しんでください。",
    "プログラミングは面白くて挑戦的な活動です。",
    "速く正確にタイピングできるように練習しましょう。",
    "コーディングは新しいスキルを身につける素晴らしい方法です。",
    "心に光を灯し、夢に翼を広げよう。",
    "雨の日も晴れの日も、笑顔は心の晴れやかな青空。",
    "時間は宝石のように輝き、使い方次第で人生が彩られる。",
    "花は一度咲いたら、いつかは必ず枯れる。その美しさを大切に。",
    "希望の灯りを消さない限り、どんな暗闇も乗り越えられる。",
    "人生の旅路は山あり谷あり。進む先には新たな景色が広がっている。",
    "心の花を咲かせるには、愛と感謝の水をそっと注ぎ続けよう。",
    "風が吹けば桶屋が儲かると言いますが、変化にはチャンスが潜んでいる。",
    "小さな一歩が、大きな冒険の始まりとなることもある。",
    "人は皆、星のように輝く可能性を秘めている。自分の輝きを信じよう。",
    "忍耐は時には力よりも強く、静かなる勇気を持つ者に報いをもたらす。",
    "夢に向かって進む者は、自らの足跡を未来への道しるべとする。",
    "一瞬の勇気が、一生の思い出を生むこともある。",
    "心の扉は内側から開くもの。希望と決意でそのドアを開けよう。",
    "愛と理解が紡ぐ糸で結ばれた絆は、時を超えて色褪せることがない。",
    "人生は音楽のように、高い音も低い音も美しい調和を奏でるべきだ。",
    "心の窓を開けば、新しい可能性が風と共に心に舞い込む。",
    "失敗は成功のもう一歩手前。挫折を乗り越える勇気こそが輝きを生む。",
    "人との出会いは、新しい本を開くようなもの。",
    "人生の旅は星座のように、点と点が繋がって初めて美しい絵を描く。",
    "涙が空を濡らす時、心は新しい花を咲かせる兆し。",
    "一瞬の微笑みが、長い一日を彩る小さな魔法。",
    "心の余白を大切に。そこに新しいアイデアが生まれることもある。",
    "道は曲がりくねり、でも曲がりくねった先には驚きが待っている。",
    "時には深呼吸して、人生のステージに立つ勇気を持とう。"
];

//ランダムなセンテンスの取得
function getRandomSentences(count) {
const shuffledSentences = sentences.sort(() => Math.random() - 0.5);
return shuffledSentences.slice(0, count);
}

const sentenceContainer1 = document.getElementById('sentence-container-1');
const sentenceContainer2 = document.getElementById('sentence-container-2');
const inputSentence = document.getElementById('input-sentence');
const result = document.getElementById('result');

let currentSentenceIndex = 0;
let startTime;

function startGame() {
const randomSentences = getRandomSentences(10);
sentences.splice(0, sentences.length, ...randomSentences);
currentSentenceIndex = 0;
renderSentence();
renderOpponentSentence(); // グレーのお題表示
inputSentence.innerHTML = '';
inputSentence.focus();
startTime = new Date();

}

//お題のセンテンスを画面に描画
function renderSentence() {
//sentences 配列から現在のセンテンスを取得
//currentSentence 現在のセンテンスを保持するための変数
const currentSentence = sentences[currentSentenceIndex];
//sentenceContainer と呼ばれるHTML要素の innerHTML プロパティを空の文字列に設定.
//これにより、以前に表示されていたセンテンスがクリアされ、新しいセンテンスが表示される準備が整います。
sentenceContainer1.innerHTML = '';

for (let i = 0; i < currentSentence.length; i++) {
  // お題の各文字をspan要素に分割
  const span = document.createElement('span');
  span.textContent = currentSentence[i];
  sentenceContainer1.appendChild(span);
}
}

// 新しく追加した関数：お題のセンテンスをグレーで表示する
function renderOpponentSentence() {
    const stageIndex = currentSentenceIndex;
    const currentSentence = sentences[currentSentenceIndex];
    sentenceContainer2.innerHTML = '';

    //const typingSpeed = 120; // 120文字/分のタイピング速度
    typingSpeed = 120; // 120文字/分のタイピング速度
    const delayPerCharacter = (60 / typingSpeed) * 1000; // 1文字あたりの表示遅延時間（ミリ秒）

    
    for (let i = 0; i < currentSentence.length; i++) {
    const span2 = document.createElement('span');
    span2.textContent = currentSentence[i];
    //span.style.color = 'gray'; // グレーに設定

    // グレーに設定 この内容をcase3の部分で設定できない？sentence1の方はcase3の方で色変更してる
    span2.style.color = 'black'; // 初めは黒で設定

    
    setTimeout(() => {
        span2.style.color = 'white'; // 指定時間後にグレーに変更
        
        if (i == currentSentence.length - 1) {
            // 最後の文字の場合、loseFlagをtrueに設定
            loseFlagArray[stageIndex] = true;
        }
        
    }, i * delayPerCharacter);

    sentenceContainer2.appendChild(span2);
    //span.classList.add('typed');//これを136文字/minでやりたい。
    }
/*
    setTimeout(() => {
        loseFlag = true; 
    }, delayPerCharacter*currentSentence.length);
    */
}


function endGame() {
    const endTime = new Date();
    const elapsedTime = (endTime - startTime) / 1000; // in seconds
    const charactersPerMinute = (sentences.reduce((acc, sentence) => acc + sentence.length, 0) / elapsedTime) * 60;
    const charactersPerSecond = charactersPerMinute / 60;
    dakenbyo = charactersPerSecond.toFixed(2);
    //result.textContent = `タイピング完了！速度: ${charactersPerMinute.toFixed(2)} 文字/min`;
    if(myScore >= 5){
        player_win = 1;
    }else{
        player_win = -1;
    }
    player_rateCalculate();
    if (player_win == 1){
        userWinningStreak++;
    }else{
        userWinningStreak = 0;
    }
    postRate(player_name);
    myScore = 0;
    opponentScore = 0;
}

function drawSentenceOutline(x, y, width, height){
    // 角丸にしたい長方形の座標とサイズ
    //var x = 20;
    //var y = 150;
    //var width = 800;
    //var height = 80;
    var cornerRadius = 20; // 角の半径


    // 描画コンテキストの設定
    context.fillStyle = "white";
    context.lineJoin = "round";
    context.lineWidth = cornerRadius;
    context.strokeStyle = "white";

    // 長方形を描画
    context.strokeRect(x + cornerRadius / 2, y + cornerRadius / 2, width - cornerRadius, height - cornerRadius);
    context.fillRect(x + cornerRadius / 2, y + cornerRadius / 2, width - cornerRadius, height - cornerRadius);

    // 角の部分を円弧で描画
    context.beginPath();
    context.arc(x + cornerRadius, y + cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
    context.arc(x + width - cornerRadius, y + cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
    context.arc(x + width - cornerRadius, y + height - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
    context.arc(x + cornerRadius, y + height - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
    context.closePath();
    //context.stroke();
}

function drawInputLine(){
    context.lineWidth = 5;
    context.strokeStyle = "white";
    // パスの開始
    context.beginPath();
    // 線の開始位置
    context.moveTo(20, 190);
    // 開始以降の線の位置
    context.lineTo(STAGE_WIDTH - 20, 190);
    // パスを閉じる
    context.stroke();
    
}
 // 円を描画する関数
 function drawFillCircle(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = 'black'; // 円の塗りつぶし色
    context.fill();
    context.closePath();
}
function drawScoreBall(){
    //背景の白帯
    context.fillStyle = "white";
    context.fillRect(0,STAGE_HEIGHT/2,STAGE_WIDTH,100);
    // 初期位置
     // 円の直径
     var radius = 25;
    // 中央の列から描画を開始するためのオフセット
    //var offsetX = (STAGE_WIDTH - (diameter * 10)) / 2;
    var x = 300;
    var y = STAGE_HEIGHT / 2 + 50;

    // 繰り返し描画
    for (var i = 0; i < 10; i++) {
        drawFillCircle(x,y,radius);

        // x座標を更新
        x += radius * 3; // 円同士の間隔
    }
}
function drawFillBlueCircle(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = 'blue'; // 円の塗りつぶし色
    context.fill();
    context.closePath();
}
function drawBlueBall(){
    var x = 300;
    var y = STAGE_HEIGHT / 2 + 50;
    var radius = 25;
    var index = myScore + opponentScore;
    x += (radius * 3) *(index-1);
    drawFillBlueCircle(x,y,radius);
}
function drawFillRedCircle(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = 'red'; // 円の塗りつぶし色
    context.fill();
    context.closePath();
}
function drawRedBall(){
    var x = 300;
    var y = STAGE_HEIGHT / 2 + 50;
    var radius = 25;
    var index = myScore + opponentScore;
    x += (radius * 3) *(index-1);
    drawFillRedCircle(x,y,radius);
}
function drawMatchCharacter() {
    context.drawImage(playerCharacterImage, 10, 250,300,300);
    context.drawImage(cpuCharacterImage, 990, 250,300,300);
}
function drawRate(){
    context.fillStyle = "white";
    context.font = "bold 50px メイリオ";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillText("レート："+ String(player_rate), STAGE_WIDTH /5 + 50, STAGE_HEIGHT/2-50);
    context.fillText("レート：" + String(cpuRate), STAGE_WIDTH *3 /5 - 50, STAGE_HEIGHT/2-50 + 150);
}



//--------------------------------------------------

/**
 * **** **** **** **** **** **** **** ****
 * ビュー関連
 * **** **** **** **** **** **** **** ****
 */
/**
 * タイトル画面の描画
 */
function drawTitle(titleText) {
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillStyle = "rgba(" + [0, 0, 0, 0.4] + ")";
    if (phase == 0)  context.drawImage(titleImage, 0, 0);
    if (phase == 4){
        context.drawImage(backgroundImage, 0, 0);
        context.fillRect(0, 483, 1280, 100);
    }
    if (isTitleGuide == false) return;
    context.fillStyle = "white";
    context.font = "70px arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillText(titleText, canvas.width / 2, 3*canvas.height / 4);
}


/**
 * プレイヤーの名前
 */
function drawplayername(player_name) {
    context.fillStyle = "white";
    context.font = "70px arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillText(player_name, 350, canvas.height / 5);
}

/**
 * スコアの描画
 */
function drawScore() {
    context.fillStyle = "white";
    context.font = "16px arial";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillText("SCORE", 16, 16);
 
    context.fillStyle = "white";
    context.font = "16px arial";
    context.textAlign = "right";
    context.textBaseline = "top";
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillText(String(score), 208, 32);
}
/**
 * ハイスコアの描画
 */
function drawHighScore() {
    context.fillStyle = "white";
    context.font = "bold 32px メイリオ";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillText("レート", 14, 48);
 
    context.fillStyle = "white";
    context.font = "bold 32px メイリオ";
    context.textAlign = "right";
    context.textBaseline = "top";
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillText(String(player_rate), 208, 64);
}

/**
 * 英語、日本語表示用（作成者　長谷川）
 */
function someFunctionInMainJS() {
    // ここでselectedLevelを使用する
    switch (selectedLevel) {
        case '1':
            drawTitle("スタート");
            break;
        case '2':
            drawTitle("START");
            break;
    }
    console.log(selectedLevel);
}
/**
 * タッチカウントの表示
 */
// function drawTouchCount() {
//     context.fillStyle = "white";
//     context.font = "16px arial";
//     context.textAlign = "left";
//     context.textBaseline = "top";
//     context.shadowColor = null;
//     context.shadowOffsetX = null;
//     context.shadowOffsetY = null;
//     context.shadowBlur = null;
//     context.fillText("TOUCH COUNT", 16, 48);
 
//     context.fillStyle = "white";
//     context.font = "16px arial";
//     context.textAlign = "right";
//     context.textBaseline = "top";
//     context.shadowColor = null;
//     context.shadowOffsetX = null;
//     context.shadowOffsetY = null;
//     context.shadowBlur = null;
//     context.fillText(String(touchCount), 208, 64);
// }
/**
 * **** **** **** **** **** **** **** ****
 * サーバとの通信関連
 * **** **** **** **** **** **** **** ****
 */
/**
 * ゲームデータのリセット
 */
function resetData() {
    resetMap();
    count = 3;
    remainingTime = 5;
    score = 0;
    touchCount = 0;
}
/**
 * マップデータのリセット
 */
function resetMap() {
    map = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
}

/**
 * CPU画像のランダム決定
 */
function decideCpuImage(){
    let randomIndex = Math.floor(Math.random() * characterSrc.length);
    let selectedCharacterSrc = characterSrc[randomIndex];

    cpuCharacterImage.src = selectedCharacterSrc;
    cpuCharacterImage.onload = function() {
        console.log(cpuCharacterImage.src + " : ロード完了");
    }
}

/**
 * キャンバスへのマウスクリック
 */
function onCanvasClick(e) {
    let loc = windowToCanvas(e.clientX, e.clientY);
    
    switch (phase) {
    case 0:
	    // タイトルフェーズで画面がクリックされた
        lastmatchingTime = Date.now();
	    resetData();
        decideCpuImage();  //CPUの画像をランダムに決定する。
	    phase = 1;              // マッチングフェーズに移行する。
        CpuRateCalculate();
	    break;
    case 3:     // 以下を追加
        // タッチフェーズでセルがクリックされた
        for (let y = 0; y < cells.length; y++) {
            for (let x = 0; x < cells[y].length; x++) {
                if (cells[y][x].isWithin(loc.x, loc.y)) {
                    isTouched(x, y);
                }
            }
        }
        break;
    case 4:
        // 結果画面フェーズ
        lastmatchingTime = Date.now();
	    resetData();
        decideCpuImage();  //CPUの画像をランダムに決定する。
	    phase = 1;              // マッチングフェーズに移行する。
        CpuRateCalculate();
	    break;
    }
}
/**
 * 背景の描画
 */
function drawBackground() {
    context.drawImage(backgroundImage, 0, 0);
}
/**
 * キャラクターの描画
 */
function drawCharacter() {
    context.drawImage(playerCharacterImage, 200, 250);
    context.drawImage(cpuCharacterImage, 800, 250);
}

/**
 * マッチング画面の描画
 */
function drawmatchingScreen() {
    context.drawImage(matchingImage, 0, 0);
}

/**
 * マップの色の描画
 */
function resetMapColor() {
    mapColor = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
}
/**
 * マップの描画
 */
function drawMap() {
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] == 0) continue;
            if (mapColor[y][x] == 1){
                fillStyleColor = "greenyellow";
            }

            else    fillStyleColor = "skyblue";

            let left = STAGE_LEFT + CELL_SIZE * x;
            let top = STAGE_TOP + CELL_SIZE * y;
            context.strokeStyle = "white";
            context.fillStyle = fillStyleColor;

            context.strokeRect(left, top, CELL_SIZE, CELL_SIZE);
            context.fillRect(left, top, CELL_SIZE, CELL_SIZE);
        }
    }
}

/**
 * 連打メーターの描画
 */
function drawmeter() {
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.strokeStyle = "white";
    context.fillStyle = "white";

    context.strokeRect(370, 45, 256, 9);
    context.fillRect(370, 45, 256, 9);

    for (let c = 0; c < touchCount; c++)
    {
        context.strokeStyle = "white";
        context.fillStyle = "lime";
        
        let left = 370 + 8 * c;
        context.strokeRect(left, 45, 8, 9);
        context.fillRect(left, 45, 8, 9);
    }

    for (let i = 0; i < 4; i++)
    {
        context.strokeStyle = "black";
        context.fillStyle = "black";
        let left = 370 + 64 * i;
        context.strokeRect(left, 45, 1, 9);
        context.fillRect(left, 45, 1, 9);
    }
}
/**
 * マッチング時、必要要素の描画
 */
function drawmatchingdata() {
    context.fillStyle = "white";
    context.font = "80px arial";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.shadowColor = "black";
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    context.shadowBlur = 20;
    context.fillText(String(player_name), canvas.width / 4, canvas.height / 4);
    context.fillText("name2", (canvas.width / 4) + (canvas.width / 2), canvas.height / 4);
    context.font = "40px arial";
    context.fillText("レート：" + String(player_rate), canvas.width / 4, (canvas.height / 4 + canvas.height / 2));
    context.fillText("レート：" + String(cpuRate), (canvas.width / 4) + (canvas.width / 2), (canvas.height / 4 + canvas.height / 2));
    context.fillText(String(userWinningStreak)+"連勝中！", canvas.width / 4, (canvas.height / 4 + canvas.height / 1.8));
    context.fillText(String(cpuWinningStreak)+"連勝中！" , (canvas.width / 4) + (canvas.width / 2), (canvas.height / 4 + canvas.height / 1.8));

}

function drawresult() {
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillStyle = "rgba(" + [256, 256, 256, 0.8] + ")";
    context.fillRect(100, 100, 1080, 300);

    context.fillStyle = "black";
    context.fillRect(60, 60, 310, 80);
    context.fillStyle = "white";
    context.font = "60px arial";
    context.textAlign = "left";
    context.textBaseline = "center";
    context.shadowColor = "white";
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    context.shadowBlur = 20;
    context.fillText("対戦結果",90, 105);
    if (player_win == 1){                   //プレイヤーが勝ったとき
        context.fillStyle = "yellow";
        context.strokeStyle = "red";    // 縁取りの色
        context.lineWidth = 10;          // 縁取りの幅
        context.font = "bold 100px meiryo";
        context.shadowColor = null;
        context.shadowOffsetX = null;
        context.shadowOffsetY = null;
        context.shadowBlur = null;
        context.strokeText(player_name + " Win!!" ,120, 280);
        context.fillText(player_name + " Win!!" ,120, 280);
        context.shadowColor = null;
        context.shadowOffsetX = null;
        context.shadowOffsetY = null;
        context.shadowBlur = null;
        context.fillStyle = "rgba(" + [220, 70, 0, 0.5] + ")";
        context.fillRect(885, 280, 270, 90);
        context.fillStyle = "white";
        context.font = "80px arial";
        context.textAlign = "left";
        context.textBaseline = "center";
        context.shadowColor = null;
        context.shadowOffsetX = null;
        context.shadowOffsetY = null;
        context.shadowBlur = null;
        context.fillText(player_rate + "⇧",900, 330);
    }
    else{                                   //プレイヤーが負けたとき
        context.fillStyle = "white";
        context.strokeStyle = "cornflowerblue";    // 縁取りの色
        context.lineWidth = 15;          // 縁取りの幅
        context.font = "bold 100px meiryo";
        context.shadowColor = null;
        context.shadowOffsetX = null;
        context.shadowOffsetY = null;
        context.shadowBlur = null;
        context.strokeText(player_name + " LOSE…" ,120, 280);
        context.fillText(player_name + " LOSE…" ,120, 280);
        context.shadowColor = null;
        context.shadowOffsetX = null;
        context.shadowOffsetY = null;
        context.shadowBlur = null;
        context.fillStyle = "rgba(" + [0, 0, 200, 0.5] + ")";
        context.fillRect(875, 280, 280, 90);
        context.fillStyle = "white";
        context.font = "80px arial";
        context.textAlign = "left";
        context.textBaseline = "center";
        context.shadowColor = null;
        context.shadowOffsetX = null;
        context.shadowOffsetY = null;
        context.shadowBlur = null;
        context.fillText(player_rate + "⇩",900, 330);
    }

    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillStyle = "rgba(" + [0, 200, 0, 0.5] + ")";
    context.fillRect(855, 150, 300, 65);
    context.fillStyle = "white";
    context.font = "50px arial";
    context.textAlign = "left";
    context.textBaseline = "center";
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillText("文字/秒 :" + dakenbyo ,860, 185);
    
}

/**
 * カウントの描画
 */
function drawCount() {
    strCount = count <= 0 ? "GO!" : count;

    context.fillStyle = "white";
    context.font = "384px arial";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.shadowColor = "black";
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    context.shadowBlur = 20;
    context.fillText(strCount, canvas.width / 2, STAGE_TOP, STAGE_WIDTH);
}
/**
 * 残り時間の描画
 */
function drawRemainingTime() {
    context.fillStyle = remainingTime <= 5 ? "red" : "white";
    context.font = "48px arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.fillText(String(remainingTime), 320, 40);
}

function put() {
    resetMap();
    resetMapColor();
    gamecellcount = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            // セルごとに40%の確率でターゲットを配置する。
            if (Math.random() > 0.4) continue;
            map[y][x] = 1;
            gamecellcount++;

            if (Math.random() > 0.1) continue;
            mapColor[y][x] = 1;     //10%の確率で色をレア色にする。
        }
    }
}

/**
 * ウィンドウ座標からキャンバス座標に変換する
 * @param wx		ウィンドウ上のx座標
 * @param wy		ウィンドウ上のy座標
 */
function windowToCanvas(wx, wy) {
	let bbox = canvas.getBoundingClientRect();
	return {
		x: (wx - bbox.left) * (canvas.width / bbox.width),
		y: (wy - bbox.top)  * (canvas.height / bbox.height)
	};
}

/**
 * ターゲットがタッチされたか判定
 * @param x タッチされたx座標
 * @param y タッチされたy座標
 * @return true: 正解, false: ミス
 */
function isTouched(x, y) {
    if (map[y][x] == 1) {
        map[y][x] = 0;
        if (mapColor[y][x] == 1){
            score += 300;
        }
        else score += 100;

        touchCount ++;  //touchカウントをふやす。
        gamecellcount--;
        exa = 0;
        highScore = score > highScore ? score : highScore;
        return true;
    } else {
        touchCount = 0; //タッチカウントをリセット
        exa = 0;
        return false;
    }
}

/**
 * タイムアップの描画
 */
function drawTimeUp() {
    context.fillStyle = "white";
    context.font = "384px arial";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.shadowColor = "black";
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    context.shadowBlur = 20;
    context.fillText("TIME UP!", canvas.width / 2, STAGE_TOP, STAGE_WIDTH);
}
/*------------------------計算関係------------------------/*
/**
 * CPUのレートの計算
 */
function CpuRateCalculate() {
    let randomIndex = Math.floor(Math.random() * 100);
    randomIndex = Math.random() < 0.5 ? -1*randomIndex : randomIndex;
    cpuRate = player_rate + randomIndex;
}

/**
 * プレイヤーのレートの計算
 */
function player_rateCalculate() {
    let x = Math.abs(player_rate - cpuRate);
    let y = (50 * player_win) / (1 + Math.exp(-0.006 * player_win * x));
    console.log("y:" + y);
    console.log("x:" + x);
    console.log("player_win:" + player_win);
    player_rate = Math.floor(player_rate + y * (userWinningStreak * 0.1 + 1));
    console.log(player_rate);
}

/**
 * **** **** **** **** **** **** **** ****
 * 音響関連（長谷川）
 * **** **** **** **** **** **** **** ****
 */
document.addEventListener('DOMContentLoaded', function () {
    // 音声オブジェクトの作成
    const audio = new Audio('/static/sounds/bgm.mp3');
    audio.volume = 1; // 初期音量を設定 (0から1の範囲)
    audio.loop = true; // ループ再生を有効にする
 
    // ボタン要素を取得
    const volumeButton = document.getElementById('volumeButton');
 
    // ボタンクリック時の処理
    volumeButton.addEventListener('click', toggleVolume);
 
    // 音量切り替え関数
    function toggleVolume() {
        console.log('Toggle volume function called');
 
        // play() メソッドを使用して音声を再生
        audio.play();
        
        if (audio.volume === 0) {
            // 音量がゼロの場合、オフからオンに変更
            audio.volume = 1;
            volumeButton.textContent = '音量: ON';
        } else {
            // それ以外の場合、オンからオフに変更
            audio.volume = 0;
            volumeButton.textContent = '音量: OFF';
        }
    }
});

/**
 * **** **** **** **** **** **** **** ****
 * サーバとの通信関連
 * **** **** **** **** **** **** **** ****
 */
/**
 * レートの取得
 */
function getRate() {
    $.ajax({
        url: 'rate/',
        method: 'GET',
        data: {
            'player_name': player_name, //tuika
        },
        timeout: 10000,
        dataType: "json",
    }).done(function(response) {
        player_rate = response.player_rate;
        userWinningStreak = response.userWinningStreak;
        console.log('レート:', player_rate); //tuika
        console.log('連勝数:', userWinningStreak); //tuika
    }).fail(function(response) {
        window.alert("新しく右記の名前でアカウントを作成しました  :" + String(player_name));
    });
}

/**
 * レートの登録
 * @player_name		プレイヤ名
 */
function postRate(player_name) {
    $.ajax({
        url: 'rate/',
        method: 'POST',
        data: {
            'player_name': player_name,
            'player_rate': player_rate,
            'userWinningStreak': userWinningStreak
        },
        timeout: 10000,
        dataType: "json",
    }).done(function(response) {
    }).fail(function(response) {
        window.alert('postScore() : レスポンス失敗');
    });
}