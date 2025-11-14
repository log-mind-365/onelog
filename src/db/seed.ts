import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { articles } from "@/db/schemas/articles";

// Load environment variables from .env file
config();

const main = async () => {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  const db = drizzle(client);

  console.log("🌱 Starting database seeding...");

  try {
    const userId = "bcd756c9-3732-490d-86ed-3814e8be9a29";

    const articleTemplates = [
      {
        title: "오늘 하루를 돌아보며",
        content:
          "오늘은 정말 평화로운 하루였다. 아침에 일어나서 창문을 열었을 때, 따뜻한 햇살이 방 안으로 쏟아져 들어왔다.\n\n커피를 마시며 창밖을 바라보는 시간이 이렇게 소중할 줄은 몰랐다. 작은 것에 감사하는 마음을 가지게 되었다.\n\n때로는 이렇게 잠시 멈춰서 내 주변을 돌아보는 시간이 필요한 것 같다.",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "React 19와 Next.js 15 배우기",
        content:
          "최근 React 19와 Next.js 15를 배우기 시작했다. Server Components의 개념이 처음엔 어려웠지만, 점점 이해가 되기 시작했다.\n\n특히 App Router의 파일 기반 라우팅이 정말 편리하다는 것을 느꼈다. 앞으로 더 깊이 있게 공부해야겠다는 생각이 든다.\n\n새로운 기술을 배우는 것은 언제나 즐겁고 설레는 일이다.",
        emotionLevel: 3,
        accessType: "public" as const,
      },
      {
        title: "힘든 하루, 그래도 괜찮아",
        content:
          "오늘은 유독 힘든 하루였다. 아침부터 일이 꼬이기 시작했고, 예상치 못한 문제들이 연달아 발생했다.\n\n왜 나한테만 이런 일이 생기는 걸까? 라는 생각도 들었지만, 곰곰이 생각해보니 누구나 겪는 일상의 한 부분이라는 걸 깨달았다.\n\n힘들 때일수록 더 자신을 사랑하고 돌봐야 한다는 것을 배웠다. 내일은 더 나은 날이 올 거라 믿는다.",
        emotionLevel: 2,
        accessType: "private" as const,
      },
      {
        title: "내 인생 최고의 순간",
        content:
          "오늘은 내 인생에서 정말 잊을 수 없는 날이 되었다!\n\n드디어 그토록 원하던 프로젝트를 성공적으로 마무리했다. 팀원들과 함께 밤을 새워가며 노력한 결과가 빛을 발하는 순간이었다.\n\n이런 성취감을 느끼는 건 정말 오랜만이다. 노력은 배신하지 않는다는 말이 실감난다.\n\n앞으로도 이 열정을 잃지 않고 더 멋진 일들을 해내고 싶다!",
        emotionLevel: 5,
        accessType: "public" as const,
      },
      {
        title: "왜 이렇게 우울할까",
        content:
          "요즘 들어 자꾸 우울한 기분이 든다. 특별한 이유가 있는 것도 아닌데, 그냥 마음이 무겁다.\n\n주변 사람들에게 말하기도 애매하고, 혼자 끙끙 앓고 있는 것 같다.\n\n이런 감정도 언젠가는 지나갈 거라고 믿고 싶다. 천천히, 하루하루 버텨나가는 수밖에.",
        emotionLevel: 1,
        accessType: "private" as const,
      },
      {
        title: "TypeScript로 타입 안전한 코드 작성하기",
        content:
          "TypeScript를 사용하면서 느낀 점은, 타입 시스템이 정말 중요하다는 것이다.\n\n처음에는 번거롭게 느껴졌지만, 런타임 에러를 사전에 방지할 수 있다는 점에서 큰 장점이 있다.\n\n이제는 TypeScript 없이 개발하는 것이 상상이 안 된다. 타입 안전성은 코드 품질 향상에 필수적이다.",
        emotionLevel: 3,
        accessType: "public" as const,
      },
      {
        title: "주말 여행의 추억",
        content:
          "이번 주말에 다녀온 제주도 여행이 너무 좋았다.\n\n푸른 바다를 보며 걷는 산책로, 맛있는 흑돼지 고기, 그리고 따뜻한 햇살까지. 모든 것이 완벽했다.\n\n특히 성산일출봉에서 본 일출은 정말 장관이었다. 사진으로는 그 감동을 다 담을 수 없었다.\n\n다음에 또 꼭 가고 싶은 곳이다. 이런 여유로운 시간이 더 자주 있었으면 좋겠다.",
        emotionLevel: 5,
        accessType: "public" as const,
      },
      {
        title: "Supabase를 이용한 인증 구현",
        content:
          "Supabase의 인증 시스템을 프로젝트에 적용해봤다. Firebase보다 훨씬 간단하고 직관적이었다.\n\n특히 Row Level Security(RLS) 정책을 통해 데이터 접근을 제어할 수 있다는 점이 인상 깊었다.\n\nPostgreSQL 기반이라 SQL도 자유롭게 사용할 수 있어서 좋다. 앞으로도 Supabase를 메인으로 사용할 것 같다.",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "불안한 마음을 진정시키는 방법",
        content:
          "요즘 미래에 대한 불안감이 자꾸 엄습해온다.\n\n이럴 때마다 나는 명상과 호흡 운동을 한다. 천천히 숨을 들이마시고 내쉬면서, 현재에 집중하려고 노력한다.\n\n불안은 미래에 대한 걱정에서 오는 것이니, 지금 이 순간에 충실하자고 스스로에게 말한다.\n\n완벽하게 불안을 없앨 수는 없지만, 조금씩 나아지고 있다는 느낌이 든다.",
        emotionLevel: 2,
        accessType: "private" as const,
      },
      {
        title: "드디어 첫 사이드 프로젝트 배포!",
        content:
          "와! 드디어 내 첫 사이드 프로젝트를 Vercel에 배포했다!\n\n몇 달 동안 퇴근 후 시간을 쪼개서 만든 프로젝트인데, 실제로 동작하는 걸 보니 정말 뿌듯하다.\n\n비록 작은 프로젝트지만, 처음부터 끝까지 혼자 만들었다는 게 의미가 있다.\n\n이제 사용자 피드백을 받아서 더 개선해나가야겠다. 개발자로서 한 걸음 더 성장한 느낌이다!",
        emotionLevel: 5,
        accessType: "public" as const,
      },
      {
        title: "번아웃이 온 것 같다",
        content:
          "요즘 아무것도 하기 싫다. 코드를 보는 것도, 새로운 것을 배우는 것도 모두 귀찮다.\n\n이게 바로 번아웃인가 싶다. 쉬고 싶지만 쉬는 것도 불안하고...\n\n잠시 모든 것을 내려놓고 진짜 쉬어야 할 때가 온 것 같다. 나 자신을 너무 몰아붙인 건 아닐까.",
        emotionLevel: 1,
        accessType: "private" as const,
      },
      {
        title: "좋은 코드란 무엇인가",
        content:
          "최근 Clean Code 책을 읽으면서, 좋은 코드에 대해 다시 생각해보게 되었다.\n\n좋은 코드는 단순히 동작하는 코드가 아니라, 읽기 쉽고 유지보수하기 좋은 코드라는 것을 깨달았다.\n\n명확한 변수명과 함수명, 적절한 추상화 레벨, 단일 책임 원칙, 테스트 가능한 구조 등이 중요하다.\n\n앞으로 코드를 작성할 때 이런 원칙들을 염두에 두어야겠다.",
        emotionLevel: 3,
        accessType: "public" as const,
      },
      {
        title: "오늘 받은 칭찬 덕분에",
        content:
          "오늘 팀장님께 '요즘 정말 성장한 것 같다'는 칭찬을 들었다.\n\n사실 스스로는 부족하다고 느끼고 있었는데, 이런 칭찬을 들으니 정말 기분이 좋았다.\n\n누군가 내 노력을 알아봐주는 것만으로도 큰 힘이 된다는 걸 느꼈다.\n\n더 열심히 해야겠다는 동기부여가 되었다!",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "실패한 프로젝트에서 배운 것들",
        content:
          "최근에 진행한 프로젝트가 실패로 끝났다. 처음에는 정말 좌절스러웠다.\n\n하지만 돌이켜보니 이 실패에서 많은 것을 배웠다. 요구사항을 명확히 하는 것의 중요성, 정기적인 커뮤니케이션, MVP를 먼저 만드는 접근법 등.\n\n실패는 성공의 어머니라는 말이 이제야 이해가 된다. 다음에는 더 잘할 수 있을 거라고 믿는다.",
        emotionLevel: 2,
        accessType: "private" as const,
      },
      {
        title: "Drizzle ORM 사용 후기",
        content:
          "Drizzle ORM을 사용해보니 Prisma보다 가볍고 빠르다는 느낌을 받았다.\n\n특히 타입 안정성이 뛰어나고, SQL에 가까운 API가 마음에 들었다.\n\n마이그레이션도 직관적이고, Supabase와의 호환성도 좋다.\n\n앞으로 계속 사용할 것 같다. 새로운 프로젝트에 적용해보고 싶다.",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "카페에서의 코딩 타임",
        content:
          "오늘은 처음으로 카페에서 코딩을 해봤다.\n\n집중력이 더 높아지는 느낌이었고, 커피 향기와 함께 코드를 작성하니 기분이 좋았다.\n\n주변 사람들도 각자의 일을 하고 있어서 동기부여가 되었다. 앞으로 가끔씩 카페에서 작업해야겠다.",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "새벽 감성에 젖어",
        content:
          "새벽 3시, 잠이 오지 않아 이것저것 생각하고 있다.\n\n지금까지 살아온 날들이 주마등처럼 스쳐 지나간다. 잘한 것도 있고 후회되는 것도 있다.\n\n하지만 모든 순간이 지금의 나를 만들었다는 생각에 감사하다. 내일도 최선을 다해 살아야겠다.",
        emotionLevel: 3,
        accessType: "private" as const,
      },
      {
        title: "TailwindCSS의 매력",
        content:
          "TailwindCSS를 사용한 지 1년이 넘었다. 처음엔 유틸리티 클래스가 낯설었지만 이제는 없으면 안 될 정도로 익숙해졌다.\n\n반응형 디자인을 만들 때 정말 편리하고, 디자인 시스템을 유지하기도 쉽다.\n\nCSS를 직접 작성하는 것보다 훨씬 생산성이 높다고 느낀다.",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "운동을 시작한 이유",
        content:
          "오늘부터 운동을 시작했다. 건강도 챙기고 스트레스도 풀 겸 헬스장에 등록했다.\n\n처음엔 힘들었지만 운동 후 느껴지는 상쾌함이 정말 좋다.\n\n규칙적인 운동이 개발 생산성에도 도움이 될 것 같다. 꾸준히 해봐야겠다.",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "오늘의 실수와 배움",
        content:
          "오늘 프로덕션 배포에서 큰 실수를 했다. DB 마이그레이션을 잘못 실행해서 일부 데이터가 손실될 뻔했다.\n\n다행히 백업 덕분에 복구할 수 있었지만, 정말 식은땀이 났다.\n\n이번 경험을 통해 배포 전 체크리스트의 중요성을 다시 한번 깨달았다. 같은 실수는 반복하지 말아야지.",
        emotionLevel: 2,
        accessType: "private" as const,
      },
      {
        title: "독서의 즐거움",
        content:
          "요즘 출퇴근 시간에 책을 읽고 있다. 기술 서적뿐만 아니라 소설도 읽으니 마음이 풍요로워지는 느낌이다.\n\n특히 다양한 관점을 접하면서 생각의 폭이 넓어지는 것 같다.\n\n독서는 최고의 자기계발이라는 말에 공감한다.",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "팀원과의 갈등 해결",
        content:
          "오늘 팀원과의 갈등을 해결했다. 서로 오해가 있었는데, 솔직하게 대화하니 금방 풀렸다.\n\n커뮤니케이션의 중요성을 다시 느꼈다. 문제가 생기면 미루지 말고 바로 이야기하는 게 답인 것 같다.\n\n이제 더 좋은 팀워크로 일할 수 있을 것 같다.",
        emotionLevel: 3,
        accessType: "private" as const,
      },
      {
        title: "Git 커밋 메시지 잘 쓰는 법",
        content:
          "최근 Git 커밋 메시지 컨벤션에 대해 공부했다.\n\n명확한 커밋 메시지는 나중에 히스토리를 추적할 때 정말 유용하다는 걸 깨달았다.\n\nfeat, fix, docs, refactor 등의 prefix를 사용하니 훨씬 가독성이 좋아졌다.",
        emotionLevel: 3,
        accessType: "public" as const,
      },
      {
        title: "점심 메뉴 고민의 끝",
        content:
          "매일 점심 메뉴를 고르는 게 이렇게 어려울 줄이야. 오늘도 30분을 고민했다.\n\n결국 친구가 추천해준 파스타 집에 갔는데 정말 맛있었다!\n\n가끔은 익숙한 것보다 새로운 시도가 좋은 결과를 가져온다.",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "비 오는 날의 감성",
        content:
          "오늘 하루 종일 비가 왔다. 비 오는 날은 왠지 모르게 감성적이 된다.\n\n창밖을 보며 멍하니 있다가 좋아하는 음악을 들으며 코딩을 했다.\n\n이런 날씨도 나쁘지 않다. 오히려 집중이 더 잘 되는 것 같다.",
        emotionLevel: 3,
        accessType: "public" as const,
      },
      {
        title: "새로운 맥북 개봉기",
        content:
          "오늘 새 맥북이 도착했다! 개봉하는 순간부터 설레었다.\n\n개발 환경을 세팅하면서 이것저것 만져보는 재미가 쏠쏠하다.\n\n새로운 장비로 더 열심히 개발해야겠다는 동기부여가 생겼다!",
        emotionLevel: 5,
        accessType: "public" as const,
      },
      {
        title: "혼자만의 시간",
        content:
          "오늘은 모든 약속을 취소하고 혼자만의 시간을 가졌다.\n\n아무것도 하지 않고 그냥 쉬었다. 생각도 멈추고, 그저 존재하는 시간.\n\n이런 시간이 때로는 정말 필요하다는 걸 느꼈다.",
        emotionLevel: 3,
        accessType: "private" as const,
      },
      {
        title: "개발자 커뮤니티의 힘",
        content:
          "오늘 개발자 커뮤니티에서 도움을 받았다. 며칠째 해결하지 못하던 버그를 누군가가 친절하게 해결 방법을 알려줬다.\n\n이런 나눔의 문화가 개발자 생태계를 더 풍요롭게 만든다.\n\n나도 언젠가 누군가에게 도움을 줄 수 있는 개발자가 되고 싶다.",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "내일을 기대하며",
        content:
          "오늘 하루도 무사히 마무리했다. 내일은 또 어떤 일들이 기다리고 있을까.\n\n기대 반, 걱정 반이지만 그래도 새로운 하루를 맞이하는 건 언제나 설렌다.\n\n좋은 꿈 꾸고, 내일도 화이팅!",
        emotionLevel: 4,
        accessType: "public" as const,
      },
      {
        title: "회고록: 올해를 돌아보며",
        content:
          "올해도 어느덧 막바지에 접어들었다. 돌이켜보니 정말 많은 일이 있었다.\n\n성장도 많이 했고, 실수도 많이 했다. 하지만 모든 경험이 나를 더 나은 사람으로 만들었다.\n\n남은 시간도 최선을 다해 보내고, 내년엔 더 멋진 한 해를 만들어야겠다.",
        emotionLevel: 4,
        accessType: "private" as const,
      },
    ];

    const articlesData = [];

    // 템플릿을 반복해서 30개 생성
    // 각 아티클마다 다른 생성 시간을 부여 (최근부터 과거 순으로)
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      const template = articleTemplates[i % articleTemplates.length];
      const suffix =
        Math.floor(i / articleTemplates.length) > 0
          ? ` (${Math.floor(i / articleTemplates.length) + 1})`
          : "";

      const createdAt = new Date(now.getTime() - (29 - i) * 60 * 60 * 1000);
      const updatedAt = createdAt;

      articlesData.push({
        userId,
        title: i + template.title + suffix,
        content: template.content,
        emotionLevel: template.emotionLevel,
        accessType: template.accessType,
        createdAt,
        updatedAt,
      });
    }

    const insertedArticles = await db
      .insert(articles)
      .values(articlesData)
      .returning();

    console.log(`✅ Created ${insertedArticles.length} articles`);
    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await client.end();
  }
};

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
