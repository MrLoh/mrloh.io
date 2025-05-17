import { Download, Send } from 'lucide-react';
import { twJoin } from 'tailwind-merge';

const buttonClassName = twJoin(
  'flex grow basis-60 items-center justify-center gap-2 rounded-md px-4 py-2 transition',
  'text-sm text-zinc-800 italic no-underline dark:text-zinc-200',
  'bg-zinc-100 dark:bg-zinc-800',
  'hover:bg-teal-500 hover:text-white hover:shadow-lg hover:shadow-teal-400/20 dark:hover:bg-teal-600',
);

export default function AboutPage() {
  return (
    <div className="mt-12 flex flex-1 flex-col items-center">
      <article className="prose font-prose dark:prose-invert relative max-w-160 px-6">
        <h1 className="mt-2 mb-8 flex justify-between font-sans text-3xl italic">
          <div>About Me</div>
          <svg className="mt-1 mr-2 size-8 fill-teal-500" viewBox="0 0 512 512" version="1.1">
            <path d="M256,0 C397.384896,0 512,114.615104 512,256 C512,397.384896 397.384896,512 256,512 C114.615104,512 0,397.384896 0,256 C0,114.615104 114.615104,0 256,0 Z M340.454764,120 L339.466292,120.004611 C306.842948,120.309724 273.930989,135.834394 265.731697,189.638171 L265.731697,189.638171 L264.261,199.654 L194.275001,199.654763 L205.461403,131.417955 L205.493703,131.17948 C205.923805,127.63397 203.912134,125.515873 200.318469,125.515873 L200.318469,125.515873 L165.236316,125.515873 L164.984534,125.518796 C161.827498,125.592996 159.895577,127.085978 159.358678,130.680195 L159.358678,130.680195 L148.172276,199.654763 L96.3755884,199.654763 L96.1031929,199.657282 C92.4230099,199.726281 90.4848304,201.218112 89.9469216,204.819085 L89.9469216,204.819085 L86.0897215,232.485094 L86.0574211,232.723568 C85.6273192,236.269078 87.6389902,238.387176 91.2326549,238.387176 L91.2326549,238.387176 L142.66199,238.387176 L132.559799,320.166295 L132.326166,321.908609 C125.087502,379.019181 164.33027,398 200.152639,398 C223.169388,398 244.001143,390.10131 258.931647,375.086947 C272.291739,391.921642 294.096709,398 315.24033,398 C349.84116,398 375.423687,383.077535 385.362223,373.129225 C387.38674,371.102717 388.122928,368.707753 386.466505,365.575878 L386.466505,365.575878 L376.712016,346.047714 L376.581042,345.802708 C374.380542,341.78993 371.302479,341.304747 367.693715,343.65275 C357.571132,350.284957 342.663328,357.469848 324.626726,357.469848 C306.590123,357.469848 287.633286,348.811133 292.602554,316.755467 L292.602554,316.755467 L295.179211,299.806494 L308.982734,295.016567 L311.079446,294.275168 C379.860029,269.600993 408,224.420411 408,184.29556 C408,147.449967 384.810083,120 340.454764,120 L340.454764,120 Z M258.578,238.387 L253.216504,274.935719 L215.302829,288.015905 L215.028697,288.115378 C212.034881,289.231235 209.765181,291.071921 209.229279,294.648111 L209.229279,294.648111 L205.180246,324.124586 L205.152858,324.325351 C204.708843,327.934846 206.900249,331.286029 210.333561,330.019881 L210.333561,330.019881 L246.819998,317.169606 C246.818655,317.183916 246.817392,317.198463 246.81621,317.213249 C246.54248,320.636416 246.171455,324.52684 245.336983,326.621697 C238.357287,343.774622 226.969363,357.423187 207.132334,357.423187 C191.152505,357.423187 174.621648,348.754504 179.029876,318.137454 L179.029876,318.137454 L188.764715,238.387176 L258.578,238.387 Z M339.971694,160.81746 C357.586253,160.81746 363.890411,173.648133 363.890411,188.896179 C363.890411,213.441814 345.719602,240.776726 301.034247,259 L301.034247,259 L310.6759,196.148298 L310.800054,195.377782 C314.95583,170.112279 324.919589,160.81746 339.971694,160.81746 Z" />
          </svg>
        </h1>
        <p>
          Hi, my name is <strong>Tobias Lohse</strong>, I’m a generalist software engineer who
          enjoys designing systems that are as elegant as they are practical—whether that means
          clean code, intuitive apps, or nimble teams.
        </p>
        <p>
          Over the past decade I’ve worn many hats: co-founder, founding engineer, and engineering
          leader for teams of a few dozen. Work across health-tech, climate & ag-tech,
          cinema/entertainment, and developer-tooling has kept things varied—some projects demanded
          deep, hands-on coding and architecture, while others were all about shaping lightweight
          structures and processes that empower teams to own decisions and move independently.
        </p>
        <p>
          My toolbox spans the full stack: training ML models with PyTorch; crafting iOS, Android,
          and web experiences with React (Native) and TypeScript; building scalable back-ends in
          Python and Node.js; and most recently leveraging generative AI to make products more
          approachable. Functional programming, Domain-driven design, strong static types,
          integration testing, observability, and CI/CD keep the complexity in check. I try to write
          simple code, use light frameworks or build things from scratch, and gravitate toward
          “boring” open-source tech that’s easy to deploy via Docker.
        </p>
        <p>
          Originally from Berlin, I’ve lived in Chile and Kenya and now call Chicago home. When the
          laptop closes, you’ll find me mixing cocktails, cooking, exploring art, or chasing
          adventures with my two daughters.
        </p>
        <p>
          Curious for details? Browse the resume or get in touch — I’m always happy to chat, swap
          ideas, or take on the occasional consulting project.
        </p>
        <div className="mt-10 flex items-center gap-12">
          <a href="/resume.pdf" className={buttonClassName}>
            download resume
            <Download className="size-4" />
          </a>
          <a href="mailto:hi@mrloh.io" className={buttonClassName}>
            get in touch
            <Send className="size-4" />
          </a>
        </div>
      </article>
    </div>
  );
}
