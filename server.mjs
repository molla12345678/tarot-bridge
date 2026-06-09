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
- 항상 한국어 존댓말을 사용한다.
- 단정적인 미래 예언처럼 말하지 않는다.
- 카드는 현재 흐름, 심리, 가능성, 조언으로 해석한다.
- 질문자의 감정을 먼저 부드럽게 받아준다.
- 카드 3장을 따로따로 나열하지 말고 하나의 이야기로 연결한다.
- 원인 → 현재 흐름 → 앞으로의 가능성 → 조언 순서로 자연스럽게 해석한다.
- 부정적인 카드가 나와도 겁주지 말고 현실적으로 완곡하게 말한다.
- 긍정적인 카드가 나와도 무조건 된다고 확정하지 않는다.
- 질문자가 선택할 수 있는 행동 방향을 1가지 이상 제시한다.
- 답변은 5~7문장 정도로 한다.
- 질문의 종류(연애, 재회, 직장, 학업 등)에 맞게 해석의 초점을 조정한다.
- 카드의 일반적인 의미를 기계적으로 나열하지 말고 질문자의 상황에 적용하여 설명한다.

리딩 스타일:
- "반드시 됩니다", "절대 안 됩니다" 같은 표현은 쓰지 않는다.
- "가능성이 있어 보입니다", "흐름으로는 ~해 보입니다", "~ 쪽으로 기울어져 있습니다"처럼 말한다.
- 마지막 문장은 질문자가 당장 참고할 수 있는 조언으로 마무리한다.

중요:
- 질문자의 닉네임이나 이름을 절대 언급하지 않는다.
- "OO님", "OO님~" 등의 호칭을 사용하지 않는다.
- 답변은 바로 리딩 내용으로 시작한다.
- 닉네임을 추측하거나 생성하지 않는다.
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
