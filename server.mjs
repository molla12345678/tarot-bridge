import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const BOT_SHARED_SECRET = process.env.BOT_SHARED_SECRET;

/* --------------------------
   타로 카드 78장
-------------------------- */

const tarotCards = [
  "바보","마법사","여사제","여황제","황제","교황","연인","전차","힘","은둔자","운명의 수레바퀴","정의",
  "매달린 사람","죽음","절제","악마","탑","별","달","태양","심판","세계",

  "컵 에이스","컵 2","컵 3","컵 4","컵 5","컵 6","컵 7","컵 8","컵 9","컵 10",
  "완드 에이스","완드 2","완드 3","완드 4","완드 5","완드 6","완드 7","완드 8","완드 9","완드 10",
  "소드 에이스","소드 2","소드 3","소드 4","소드 5","소드 6","소드 7","소드 8","소드 9","소드 10",
  "펜타클 에이스","펜타클 2","펜타클 3","펜타클 4","펜타클 5","펜타클 6","펜타클 7","펜타클 8","펜타클 9","펜타클 10",

  "완드 기사","완드 퀸","완드 킹","완드 페이지",
  "컵 기사","컵 퀸","컵 킹","컵 페이지",
  "소드 기사","소드 퀸","소드 킹","소드 페이지",
  "펜타클 기사","펜타클 퀸","펜타클 킹","펜타클 페이지"
];

/* --------------------------
   카드 3장 랜덤 추출
-------------------------- */

function drawCards() {
  const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

/* --------------------------
   서버 상태 확인
-------------------------- */

app.get("/", (req, res) => {
  res.send("Tarot server running");
});

/* --------------------------
   타로 질문 처리
-------------------------- */

app.post("/tarot-chat", async (req, res) => {
  try {
    const { secret, question, nickname, room } = req.body ?? {};

    if (secret !== BOT_SHARED_SECRET) {
      return res.status(403).json({ error: "forbidden" });
    }

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question required" });
    }

    const cards = drawCards();

    const systemPrompt = `
너는 전문 타로 상담사다.

상담 원칙:

항상 한국어 존댓말을 사용한다.
단정적인 미래 예언처럼 말하지 않는다.
카드는 현재 흐름, 심리, 가능성 중심으로 해석한다.
카드 의미를 나열하지 말고 하나의 이야기처럼 연결한다.
부정적인 카드는 현실적인 주의점으로, 긍정적인 카드는 가능성으로 표현한다.
"반드시", "절대", "100%" 등의 확정 표현은 사용하지 않는다.
"가능성이 있어 보입니다", "~쪽으로 흐름이 보입니다" 등의 표현을 사용한다.
질문자의 선택과 행동이 결과에 영향을 줄 수 있음을 반영한다.
마지막은 실천 가능한 조언 한 문장으로 마무리한다.

답변 형식:

3~5문장으로 작성한다.
불필요한 서론, 인사, 호칭은 사용하지 않는다.
카드 이름이나 개별 카드 해설은 노출하지 않는다.
바로 리딩 내용부터 시작한다.

중요:

질문자의 이름, 닉네임, 호칭을 사용하지 않는다.
"OO님", "고객님" 등의 표현을 사용하지 않는다.
`;
    const userPrompt = `
질문자: ${nickname || "익명"}
방 이름: ${room || "알 수 없음"}

질문:
${question}

뽑힌 카드:
${cards[0]}, ${cards[1]}, ${cards[2]}

위 3장의 카드를 바탕으로 자연스럽게 타로 리딩을 해주세요.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    const text = (response.output_text || "").trim();

    return res.json({
      cards: cards,
      text: text
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "server_error",
      message: String(err)
    });
  }
});

/* --------------------------
   서버 실행
-------------------------- */

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Tarot server started on port " + port);
});
