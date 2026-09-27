import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react';
import { ArrowRightIcon, ArrowLeftIcon, HeartIcon, CheckIcon, Cross2Icon, ImageIcon, ReloadIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { Carousel } from './mobile/Carousel';
import * as Dialog from '@radix-ui/react-dialog';
import '@fontsource/caveat/cyrillic-400.css';
import '@fontsource/caveat/latin-400.css';
import '@fontsource/cormorant-garamond/cyrillic-700.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/manrope/cyrillic-400.css';
import '@fontsource/manrope/cyrillic-600.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';

import { ListFields, PhotoFields } from './GiftForms';
import { QuizEditor, QuizGame, defaultQuestions, questionValid, type Question } from './Quiz';
import FlipCard from './components/react-bits/FlipCard';
import { Confetti } from './components/magicui/confetti';

type Screen = 'home' | 'write' | 'gift' | 'configure' | 'play' | 'ready' | 'recipient' | 'letter';
const giftChoices = ['Завтрак в постель', 'Вечер только для нас', 'Обниматься сколько угодно'];
const initialMessage = 'Я подготовил(а) для тебя кое-что особенное.\n\nЗдесь нет ничего сложного — просто несколько вещей, которые я хотел(а) тебе сказать, показать, напомнить.\n\nТак что листай дальше.';
function Brand() { return <span className="brand-logo"><img src="/media/mybusik-logo-transparent.png" alt="mybusik" draggable={false} /></span>; }
function Button({ children, onClick, disabled = false, secondary = false }: {children:React.ReactNode;onClick:()=>void;disabled?:boolean;secondary?:boolean}) {
 return <motion.button type="button" className={secondary?'secondary-button':'primary-button'} onClick={onClick} disabled={disabled} whileTap={{scale:.965}} transition={{type:'spring',stiffness:460,damping:24}}>{children}</motion.button>;
}
const mechanicTitles=['Наши воспоминания','Секрет для тебя','Заряди сердце','Собери наш момент','Найди совпадения','Как хорошо ты меня знаешь?','Купоны с любовью','Автомат свиданий'];
type Settings={interactive:boolean[];captions:string[];secret:string;heart:string;places:string[];food:string[];activities:string[];coupons:string[];questions:Question[]};
const defaultSettings:Settings={interactive:[true,true,true,true,true,true,true,true],captions:['Наш маленький счастливый момент','Помнишь, как мы смеялись?','Хочу ещё много таких дней'],secret:'Моё любимое место — рядом с тобой.',heart:'Ты делаешь мой мир теплее.',places:['Уютный вечер дома','Пикник у озера','Прогулка по городу'],food:['Пицца на двоих','Любимый десерт','Домашний ужин'],activities:['Фильм без телефонов','Танцы на кухне','Говорить обо всём'],coupons:['Обниматься сколько угодно','Массаж после длинного дня','Прогулка в твоё любимое место'],questions:defaultQuestions};
const lines=(value:string[])=>value.map(v=>v.trim()).filter(Boolean).slice(0,5);
function Celebration({id,festive=false}:{id:number;festive?:boolean}) {
 const reduce=useReducedMotion();
 if(!id||reduce)return null;
 if(festive)return <Confetti key={id} options={{particleCount:36,spread:80,startVelocity:12,gravity:.9,ticks:80,scalar:.9,origin:{x:.5,y:.65},colors:['#e68191','#d5afd7','#fff4e8','#9b456e'],disableForReducedMotion:true}} globalOptions={{resize:true,useWorker:false}} className="mechanic-confetti" aria-hidden="true"/>;
 return <div className="celebration" aria-hidden="true" key={id}>{Array.from({length:12},(_,i)=><motion.span key={i} initial={{x:0,y:0,opacity:1,scale:.5}} animate={{x:Math.cos(i*Math.PI/6)*110,y:Math.sin(i*Math.PI/6)*100-60,opacity:0,scale:1.2,rotate:i*35}} transition={{duration:.85,ease:'easeOut'}}>♥</motion.span>)}</div>;
}
function StageProgress({current,total,label}:{current:number;total:number;label:string}) {
 return <div className="journey-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current} aria-label={label}><div className="journey-label"><span>{label}</span><span>{current} / {total}</span></div><div className="journey-segments">{Array.from({length:total},(_,i)=><span key={i} className={i<current?'filled':''}/>)}</div></div>;
}
function BusikGuide({text}:{text:string}) {return <aside className="busik-guide"><img src="/media/busik-hero.png" alt=""/><p><b>Бусик рядом</b>{text}</p></aside>;}
function MemoryGame({photos,captions,interactive=true}:{photos:string[];captions:string[];interactive?:boolean}) {
 const [flipped,setFlipped]=useState<number[]>([]);
 const pics=photos.length?photos:['/media/busik-hero.png'];
 return <>
  <p className="intro">{interactive?'Листай наши моменты. Нажми на фото — там кое-что написано.':'Наши фотографии и маленькие истории.'}</p>
  <Carousel className="memories-carousel" contentClassName="memories-track" ariaLabel="Фото-воспоминания">
   {pics.map((p,i)=>interactive?<FlipCard key={i} className="memory-flip" width={260} height={311} radius={8} background="#fffaf6" color="#3f1732" shadowColor="#713f51" shadowOpacity={.12} draggable={false} tiltMax={5} glareOpacity={.12} hoverScale={1.015} stiffness={180} damping={24} flipped={flipped.includes(i)} onFlipChange={back=>setFlipped(prev=>back?[...prev.filter(n=>n!==i),i]:prev.filter(n=>n!==i))} ariaLabel={'Перевернуть воспоминание '+(i+1)} front={<div className="memory-face"><img src={p} alt={'Воспоминание '+(i+1)} draggable={false}/><span>{i+1} / {pics.length} · Переверни меня</span></div>} back={<div className={'memory-message'+((captions[i]?.length||0)>110?' is-long':'')}><HeartIcon/><span>ЗАПИСКА К МОМЕНТУ</span><p>{captions[i]||'Мой любимый момент — любой, где есть ты.'}</p><small>{i+1} / {pics.length} · Вернуть фото</small></div>}/>:<article key={i} className="polaroid"><img src={p} alt={'Воспоминание '+(i+1)} draggable={false}/><span>{i+1} / {pics.length} · {captions[i]||'Наш счастливый момент'}</span></article>)}
  </Carousel>
  <p className="hint">{photos.length?'Ваши фотографии, ваши маленькие истории.':'Пока здесь Бусик. Автор может добавить свои фото.'}</p>
 </>;
}
const pairSymbols=['♥','☀','✿','☾','♫','✦'];
const pairNames=['Сердце','Солнце','Цветок','Луна','Музыка','Звезда'];
function MatchingGame({photos=[],interactive=true,onComplete}:{photos?:string[];interactive?:boolean;onComplete:(complete:boolean)=>void}) {
 const pairCount=photos.length||pairSymbols.length;
 const [cards]=useState(()=>{
  const deck=Array.from({length:pairCount},(_,pair)=>[pair,pair]).flat();
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
  return deck;
 });
 const [opened,setOpened]=useState<number[]>([]);const [matched,setMatched]=useState<number[]>([]);
 const [attempts,setAttempts]=useState(0);const reduce=useReducedMotion();
 const complete=!interactive||matched.length===cards.length;
 useEffect(()=>{onComplete(complete);},[complete,onComplete]);
 useEffect(()=>{
  if(opened.length!==2)return;
  const timer=setTimeout(()=>setOpened([]),900);
  return()=>clearTimeout(timer);
 },[opened]);
 const choose=(i:number)=>{
  if(complete||opened.length===2||opened.includes(i)||matched.includes(i))return;
  if(opened.length===0){setOpened([i]);return;}
  setAttempts(n=>n+1);
  if(cards[opened[0]]===cards[i]){setMatched(prev=>[...prev,opened[0],i]);setOpened([]);}
  else setOpened([opened[0],i]);
 };
 return <><p className="intro">{interactive?'Открывай по две карточки и ищи одинаковые. Найденные пары останутся с тобой.':'Маленькие совпадения — как вы двое.'}</p>
 <div className={"matching-board"+(pairCount===2?" two-pairs":"")} role="group" aria-label="Карточки для поиска пар">{cards.map((pair,i)=>{
  const visible=complete||opened.includes(i)||matched.includes(i);const found=matched.includes(i);
  return <button type="button" key={i} className={'matching-card'+(visible?' is-open':'')+(found?' is-matched':'')} aria-label={`Карточка ${i+1}: ${visible?(photos.length?`Фото ${pair+1}`:pairNames[pair])+(found?', пара найдена':''):'закрыта'}`} aria-pressed={visible} disabled={complete||found||opened.includes(i)||opened.length===2} onClick={()=>choose(i)}>
   <motion.span className="matching-card-inner" animate={{rotateY:visible?180:0}} transition={{duration:reduce?0:.35}}>
    <span className="matching-card-back" aria-hidden="true"><HeartIcon/><small>mybusik</small></span>
    <span className="matching-card-front" aria-hidden="true"><span>{photos.length?<img src={photos[pair]} alt="" draggable={false}/>:pairSymbols[pair]}</span>{found&&<CheckIcon/>}</span>
   </motion.span>
  </button>;
 })}</div>
 <p className="hint" role="status">{!interactive?'Все карточки открыты ♥':complete?'Все пары найдены. Вы — любимое совпадение ♥':`Найдено ${matched.length/2} из ${pairCount} пар · попыток: ${attempts}`}</p>
 <Celebration id={complete&&interactive?1:0} festive/>
 </>;
}
function ScratchGame({secret,interactive=true}:{secret:string;interactive?:boolean}) {
 const ref=useRef<HTMLCanvasElement>(null);const drawing=useRef(false);const prev=useRef<{x:number;y:number}|null>(null);const [opened,setOpened]=useState(!interactive);const [progress,setProgress]=useState(0);
 useEffect(()=>{const c=ref.current;const ctx=c?.getContext('2d');if(!ctx||!c)return;ctx.fillStyle='#c796ad';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#fff5f2';ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText('Сотри сердечный секрет',c.width/2,c.height/2);},[]);
 const point=(e:React.PointerEvent<HTMLCanvasElement>)=>{const c=e.currentTarget,r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height};};
 const erase=(e:React.PointerEvent<HTMLCanvasElement>)=>{const c=e.currentTarget,ctx=c.getContext('2d');if(!ctx)return;const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.lineWidth=34;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(prev.current?.x??p.x,prev.current?.y??p.y);ctx.lineTo(p.x,p.y);ctx.stroke();prev.current=p;};
 const measure=()=>{const c=ref.current,ctx=c?.getContext('2d');if(!ctx||!c)return;const pixels=ctx.getImageData(0,0,c.width,c.height).data;let clear=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]<128)clear++;const n=Math.round(clear/(c.width*c.height)*100);setProgress(n);if(n>=45)setOpened(true);};
 return <><p className="intro">{interactive?'Проведи пальцем или мышью по покрытию.':'Записка только для тебя.'}</p><div className="scratch-card"><div className="secret-content"><HeartIcon/><p>{secret}</p></div>{!opened&&<canvas ref={ref} width={300} height={210} data-scroll-drag="ignore" aria-label="Покрытие секретной открытки" onPointerDown={e=>{drawing.current=true;prev.current=null;e.currentTarget.setPointerCapture(e.pointerId);erase(e);}} onPointerMove={e=>{if(drawing.current)erase(e);}} onPointerUp={()=>{drawing.current=false;prev.current=null;measure();}} onPointerCancel={()=>{drawing.current=false;prev.current=null;}}/>}<Celebration id={opened&&interactive?1:0} festive/></div><p className="hint" role="status">{opened?'Секрет открыт ♥':`Стёрто ${progress}% · после 45% откроется всё`}</p>{!opened&&<button type="button" className="small-link" onClick={()=>setOpened(true)}>Открыть без стирания</button>}</>;
}
function HeartGame({text,interactive=true}:{text:string;interactive?:boolean}) {
 const [taps,setTaps]=useState(interactive?0:10);const full=taps>=10;
 return <><p className="intro centered">Каждое касание — немного тепла.</p><div className="heart-game"><motion.button type="button" aria-label="Зарядить сердце" disabled={full} onClick={()=>setTaps(t=>Math.min(10,t+1))} whileTap={{scale:.88}} className={'charge-heart '+(full?'complete':'')}><span className="heart-symbol" aria-hidden="true">♥</span><span>{taps*10}%</span></motion.button><Celebration id={interactive?taps:0} festive={full}/></div><div className="charge-meter" role="progressbar" aria-label="Заряд любви" aria-valuenow={taps*10} aria-valuemin={0} aria-valuemax={100}><motion.div animate={{scaleX:taps/10}}/></div><p className="heart-message" role="status">{full?text:'Бусик бережёт для тебя ещё одно признание.'}</p>{!full&&<button type="button" className="small-link" onClick={()=>setTaps(10)}>Раскрыть сразу</button>}</>;
}
function PuzzleGame({photo,interactive=true}:{photo:string;interactive?:boolean}) {
 const [pieces,setPieces]=useState(interactive?[2,0,3,1]:[0,1,2,3]);const [selected,setSelected]=useState<number|null>(null);const [dragOrigin,setDragOrigin]=useState<number|null>(null);const board=useRef<HTMLDivElement>(null);const suppress=useRef(false);const solved=pieces.every((p,i)=>p===i);
 const swap=(a:number,b:number)=>setPieces(prev=>{const next=[...prev];[next[a],next[b]]=[next[b],next[a]];return next;});
 const choose=(i:number)=>{if(suppress.current){suppress.current=false;return;}if(solved)return;if(selected===null)setSelected(i);else{swap(selected,i);setSelected(null);}};
 return <><p className="intro">{interactive?'Перетащи фрагмент на другой или нажми на два кусочка, чтобы поменять их местами.':'Один из ваших счастливых моментов.'}</p><div ref={board} className={'puzzle-board '+(solved?'solved':'')} data-scroll-drag="ignore">{pieces.map((piece,i)=><motion.button type="button" key={i} aria-label={'Фрагмент '+(i+1)} aria-pressed={selected===i} className={selected===i?'selected':''} style={{backgroundImage:`url("${photo}")`,backgroundPosition:`${piece%2*100}% ${Math.floor(piece/2)*100}%`}} drag={!solved} dragSnapToOrigin dragElastic={.15} onDragStart={()=>{setDragOrigin(i);suppress.current=true;}} onDragEnd={(_,info)=>{const r=board.current?.getBoundingClientRect();if(r&&dragOrigin!==null){const x=info.point.x-r.left,y=info.point.y-r.top;if(x>=0&&y>=0&&x<r.width&&y<r.height)swap(dragOrigin,Math.floor(y/(r.height/2))*2+Math.floor(x/(r.width/2)));}setDragOrigin(null);setSelected(null);}} onClick={()=>choose(i)}><span className="piece-number">{i+1}</span></motion.button>)}<Celebration id={solved&&interactive?1:0} festive/></div><p className="hint" role="status">{solved?'Наш момент снова вместе ♥':selected===null?'Четыре кусочка одного счастливого момента.':'Теперь выбери второй фрагмент.'}</p>{!solved&&<button type="button" className="small-link" onClick={()=>{setPieces([0,1,2,3]);setSelected(null);}}>Показать целое фото</button>}</>;
}
function DateGame({settings,interactive=true}:{settings:Settings;interactive?:boolean}) {
 const options=[lines(settings.places),lines(settings.food),lines(settings.activities)];const [result,setResult]=useState<string[]>(interactive?[]:[lines(settings.places)[0],lines(settings.food)[0],lines(settings.activities)[0]]);const [spin,setSpin]=useState(0);const [tick,setTick]=useState(0);const [running,setRunning]=useState(false);const [accepted,setAccepted]=useState(false);const reduce=useReducedMotion();
 useEffect(()=>{if(!running)return;const interval=setInterval(()=>setTick(t=>t+1),80);const timer=setTimeout(()=>{setResult(options.map(o=>o[Math.floor(Math.random()*o.length)]||'Время вдвоём'));setRunning(false);},reduce?0:1100);return()=>{clearInterval(interval);clearTimeout(timer);};},[running,spin]);
 return <><p className="intro centered">Один запуск — ваш план на вечер.</p><div className="date-machine">{['Где','Что вкусного','Чем займёмся'].map((label,i)=><div className="date-reel" key={label}><span>{label}</span><motion.p key={running?tick:result[i]} initial={{y:reduce?0:12,opacity:.4}} animate={{y:0,opacity:1}}>{running?(options[i][tick%options[i].length]||'Время вдвоём'):result[i]||'♥ ♥ ♥'}</motion.p></div>)}<Celebration id={!running?spin:0} festive/></div>{interactive&&<Button disabled={running||accepted} onClick={()=>{setSpin(s=>s+1);setRunning(true);setAccepted(false);}}>{running?'Бусик крутит барабаны…':result.length?'Ещё один вариант':'Запустить автомат'}</Button>}{result.length>0&&!running&&<><button type="button" className="example-link" disabled={accepted} onClick={()=>setAccepted(true)}>{accepted?'Договорились ♥':'Принять план на вечер'}</button><p className="hint" role="status">{accepted?'План принят в предпросмотре. Уведомления подключим вместе с сервером.':'Можно принять план или попробовать другую комбинацию.'}</p></>}</>;
}
function CouponGame({coupons,interactive=true}:{coupons:string[];interactive?:boolean}) {
 const [saved,setSaved]=useState<number[]>([]);const [requests,setRequests]=useState<number[]>([]);
 const save=(i:number)=>setSaved(prev=>prev.includes(i)?prev:[...prev,i]);
 return <><p className="intro">{interactive?'Потяни билет вправо за пунктирный край или нажми «Забрать».':'Выбери обещание и сохрани его в коллекцию.'}</p><div className="love-coupons">{coupons.map((text,i)=><div className={'tear-coupon '+(saved.includes(i)?'saved':'')} key={i}><motion.div className="ticket-content" data-scroll-drag="ignore" drag={!interactive||saved.includes(i)?false:'x'} dragConstraints={{left:0,right:0}} dragElastic={.8} onDragEnd={(_,info)=>{if(info.offset.x>65)save(i);}}><span className="eyebrow">КУПОН 0{i+1}</span><h2>{text}</h2><div className="perforation" aria-hidden="true"/></motion.div>{saved.includes(i)?<><span className="ticket-status"><CheckIcon/> В твоей коллекции</span><button type="button" className="small-link" disabled={requests.includes(i)} onClick={()=>setRequests(prev=>[...prev,i])}>{requests.includes(i)?'Хочу воспользоваться ♥':'Хочу воспользоваться'}</button></>:<button type="button" className="small-link" onClick={()=>save(i)}>Забрать купон {i+1}</button>}</div>)}</div><p className="hint" role="status">Сохранено {saved.length} из {coupons.length}. Ответы пока остаются в этом предпросмотре.</p><Celebration id={saved.length} festive/></>;
}

function PersonalLetterContent({to,from,message,photo='',placeholder=false}:{to:string;from:string;message:string;photo?:string;placeholder?:boolean}) {
 return <><HeartIcon className="letter-heart"/><p className="letter-greeting">{to},</p>{photo&&<img className="personal-photo" src={photo} alt="Ваше общее воспоминание"/>}<p className={placeholder?'draft-placeholder':''}>{message}</p><p className="signature">С любовью,{'\n'}{from}</p></>;
}

const ignoreCompletion=(_:boolean)=>{};
function MechanicStage({index,settings,photos,pairPhotos,puzzlePhoto,author,onPairsComplete=ignoreCompletion,onQuizComplete=ignoreCompletion}:{index:number;settings:Settings;photos:string[];pairPhotos:string[];puzzlePhoto:string;author:string;onPairsComplete?:(done:boolean)=>void;onQuizComplete?:(done:boolean)=>void}) {
 const interactive=settings.interactive[index];
 switch(index){
  case 0:return <MemoryGame photos={photos} captions={settings.captions} interactive={interactive}/>;
  case 1:return <ScratchGame secret={settings.secret} interactive={interactive}/>;
  case 2:return <HeartGame text={settings.heart} interactive={interactive}/>;
  case 3:return <PuzzleGame photo={puzzlePhoto} interactive={interactive}/>;
  case 4:return <MatchingGame photos={pairPhotos} interactive={interactive} onComplete={onPairsComplete}/>;
  case 5:return <QuizGame questions={settings.questions} interactive={interactive} author={author} onComplete={onQuizComplete}/>;
  case 6:return <CouponGame coupons={lines(settings.coupons)} interactive={interactive}/>;
  default:return <DateGame settings={settings} interactive={interactive}/>;
 }
}

export default function Prototype() {
 const [screen,setScreen]=useState<Screen>('home'); const [help,setHelp]=useState(false);const [previewOpen,setPreviewOpen]=useState(false);const [previewReset,setPreviewReset]=useState(0);
 const [name,setName]=useState(''); const [from,setFrom]=useState(''); const [message,setMessage]=useState('');
 const [gift,setGift]=useState(giftChoices[0]); const [customGift,setCustomGift]=useState('');
 const [settings,setSettings]=useState<Settings>(defaultSettings);const [configIndex,setConfigIndex]=useState(0);const [playIndex,setPlayIndex]=useState(0);const [memoryPhotos,setMemoryPhotos]=useState<string[]>([]);const [pairPhotos,setPairPhotos]=useState<string[]>([]);const [puzzlePhoto,setPuzzlePhoto]=useState<string[]>([]);
 const [photo,setPhoto]=useState(''); const [photoError,setPhotoError]=useState('');
 const [demo,setDemo]=useState(false); const [pairsComplete,setPairsComplete]=useState(false);const [quizComplete,setQuizComplete]=useState(false); const [bump,setBump]=useState(0);
 const previewTriggerRef=useRef<HTMLButtonElement>(null);const fileRef=useRef<HTMLInputElement>(null); const reduce=useReducedMotion();
 const dismissInput=()=>{const active=document.activeElement;if(active instanceof HTMLInputElement||active instanceof HTMLTextAreaElement)active.blur();};
 useLayoutEffect(()=>{window.scrollTo({top:0,left:0,behavior:'auto'});},[screen,configIndex,playIndex]);
 const go=(next:Screen)=>{dismissInput();setPreviewOpen(false);setScreen(next);};
 const start=()=>{setDemo(false);go('write');};
 const preview=(example=false)=>{setDemo(example);setPlayIndex(0);setPairsComplete(false);setQuizComplete(false);go('recipient');};
 const displayName=demo?'Мой бусик':name.trim()||'Мой бусик';
 const displayFrom=demo?'Твой человек':from.trim()||'Твой человек';
 const displayMessage=demo?initialMessage:message.trim()||initialMessage;
 const activeSettings=demo?defaultSettings:settings;const pics=demo?[]:memoryPhotos.length?memoryPhotos:photo?[photo]:[];
 const setField=<K extends keyof Settings>(key:K,value:Settings[K])=>setSettings(prev=>({...prev,[key]:value}));
 const configValid=configIndex===1?!!settings.secret.trim():configIndex===2?!!settings.heart.trim():configIndex===4?pairPhotos.length!==1:configIndex===5?settings.questions.length>0&&settings.questions.every(questionValid):configIndex===6?settings.coupons.every(v=>!!v.trim()):configIndex===7?[settings.places,settings.food,settings.activities].every(v=>v.length>0&&v.every(item=>!!item.trim())):true;
 const back=()=>{if(screen==='configure'&&configIndex>0){dismissInput();setConfigIndex(i=>i-1);return;}if(screen==='play'&&playIndex>0){setPlayIndex(i=>i-1);return;}go(screen==='write'?'home':screen==='gift'?'write':screen==='configure'?'gift':screen==='ready'?'configure':screen==='recipient'?demo?'home':'ready':screen==='play'?'letter':screen==='letter'?'recipient':'home');};
 const title=screen==='configure'?mechanicTitles[configIndex]:screen==='play'?mechanicTitles[playIndex]:screen==='write'?'Пару слов от сердца':screen==='gift'?'И маленький подарок':screen==='ready'?'Всё готово, с любовью':screen==='recipient'?'Тебе кое-что передали':screen==='letter'?displayName:'';
 const mascot=<motion.img key={bump} className="mascot" src="/media/busik-hero.png" alt="Бусик держит письмо для тебя" draggable={false} animate={bump&&!reduce?{rotate:[0,-3,3,0],scale:[1,.97,1.025,1]}:{}} transition={{duration:.65}}/>;
 const author=['write','gift','configure','ready'].includes(screen);
 const constructing=['write','gift','configure'].includes(screen);
 const editorPhotos=memoryPhotos.length?memoryPhotos:photo?[photo]:[];
 const previewTitle=screen==='write'?(name.trim()||'Мой бусик'):screen==='gift'?'Твоё обещание':mechanicTitles[configIndex];
 // Reset only the preview being edited; recipient progress has separate state.
 const stageDraft=screen==='write'?[name,from,message,photo]:screen==='gift'?[gift,customGift,photo]:[settings.interactive[configIndex],configIndex===0?[editorPhotos,settings.captions]:configIndex===1?settings.secret:configIndex===2?settings.heart:configIndex===3?[puzzlePhoto,editorPhotos[0]]:configIndex===4?pairPhotos:configIndex===5?settings.questions:configIndex===6?settings.coupons:[settings.places,settings.food,settings.activities]];
 const draftKey=JSON.stringify([screen,configIndex,stageDraft,previewReset]);
 const draftValid=screen!=='configure'||(configIndex!==5||settings.questions.every(questionValid))&&(configIndex!==4||pairPhotos.length!==1);
 const previewContent=<div className="preview-stage" key={draftKey}>{screen!=='write'&&<h3>{previewTitle}</h3>}{screen==='write'?<article className="personal-letter"><PersonalLetterContent to={name.trim()||'Мой бусик'} from={from.trim()||'Твой человек'} message={message.trim()||'Здесь появятся твои тёплые слова.'} photo={photo} placeholder={!message.trim()}/></article>:screen==='gift'?<article className="tear-coupon"><span className="eyebrow">КУПОН С ЛЮБОВЬЮ</span><h2>{gift==='Свой подарок'?customGift.trim()||'Твоё маленькое обещание':gift}</h2><div className="perforation"/><p className="hint">Когда захочешь — просто напомни.</p></article>:draftValid?<div className="mechanic-surface"><MechanicStage index={configIndex} settings={{...settings,secret:settings.secret||'Здесь будет твой секрет.',heart:settings.heart||'Здесь будет твоё признание.'}} photos={editorPhotos} pairPhotos={pairPhotos} puzzlePhoto={puzzlePhoto[0]||editorPhotos[0]||'/media/busik-hero.png'} author={from.trim()||'Твой человек'}/></div>:<p className="preview-empty">{configIndex===5?'Заполни вопрос, варианты и свой ответ — здесь можно будет пройти тест.':'Добавь второе фото — и здесь появится игра с парами.'}</p>}</div>;
 const stageCurrent=screen==='write'?1:screen==='gift'?2:screen==='configure'?configIndex+3:screen==='ready'?mechanicTitles.length+3:screen==='recipient'?1:screen==='letter'?2:playIndex+3;
 const stageNames=author?['Твои слова','Маленький подарок',...mechanicTitles,'Предпросмотр']:['Открытие подарка','Личное письмо',...mechanicTitles];
 return <MotionConfig reducedMotion="user"><div className="busik-app" data-screen={screen}>
 <AnimatePresence mode="wait" initial={false}><motion.div className="page-layer" key={screen} initial={{opacity:0,y:reduce?0:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduce?0:-8}} transition={{duration:.2}}>
 {screen!=='home'&&<div className="journey-shell"><header className="inner-header"><button type="button" className="icon-button" aria-label="Назад" onClick={back}><ArrowLeftIcon/></button><Brand/><button type="button" className="icon-button" aria-label="На главную" onClick={()=>go('home')}><Cross2Icon/></button></header><StageProgress current={stageCurrent} total={stageNames.length} label={author?'Собираем твой сюрприз':'История для тебя'}/></div>}
 <div className={screen==='home'?'home-layout':'journey-layout'+(constructing?' constructor-layout':'')}>
 {screen!=='home'&&!constructing&&<aside className="desktop-guide"><span className="eyebrow">{author?'ПОДАРОК СВОИМИ РУКАМИ':'МАЛЕНЬКАЯ ИСТОРИЯ О ВАС'}</span><img className="desktop-busik" src="/media/busik-hero.png" alt="Бусик сопровождает твою историю" draggable={false}/><h2>{author?<>Давай соберём<br/>немного счастья</>:<>Здесь всё<br/>с любовью</>}</h2><p>{author?'Твои слова и ваши моменты. Я помогу превратить их в сюрприз.':'Открывай сюрпризы в своём темпе. Бусик будет рядом.'}</p><ol aria-label="Этапы подарка">{stageNames.map((name,i)=><li key={name} aria-current={i===stageCurrent-1?'step':undefined} className={i<stageCurrent-1?'done':''}><span>{i<stageCurrent-1?<CheckIcon/>:String(i+1).padStart(2,'0')}</span>{name}</li>)}</ol></aside>}
 <main className={screen==='home'?'home-page':'inner-page'}>
 {screen==='home'?<>
  <header className="home-header"><Brand/><button type="button" className="how-link" onClick={()=>setHelp(true)}>Как это работает <ArrowRightIcon/></button></header>
  <section className="hero-copy"><h1>Порадуй своего<br/>бусика <HeartIcon className="title-heart"/></h1><p>Маленький сюрприз.<br/>Просто потому что люблю.</p></section>
  <button type="button" className="mascot-stage" onClick={()=>setBump(n=>n+1)} aria-label="Погладить Бусика">{mascot}</button>
  <div className="home-actions"><Button onClick={start}>Создать сюрприз <ArrowRightIcon/></Button><button type="button" className="example-link" onClick={()=>preview(true)}>Посмотреть пример</button><p className="home-note"><HeartIcon/> Свои слова, фото и немного волшебства</p></div>
 </>:<>

  {['write','gift','ready'].includes(screen)&&<div className="step-label">{screen==='write'?'01 / Личные слова':screen==='gift'?'02 / Маленький подарок':`${String(stageNames.length).padStart(2,'0')} / Предпросмотр`}<span>Твой сюрприз</span></div>}
  {['recipient','letter'].includes(screen)&&<div className="preview-label">{demo?'Пример сюрприза':'Предпросмотр для получателя'}</div>}
  {constructing&&<div className="constructor-toolbar"><span>Собираем с любовью</span><button type="button" className="preview-trigger" ref={previewTriggerRef} onClick={()=>{dismissInput();setPreviewOpen(true);}}><EyeOpenIcon/> Предпросмотр</button></div>}
  <h1 className={screen==='letter'?'visually-hidden':'inner-title'}>{screen==='letter'?'Личное письмо':title}</h1>
  {screen==='write'&&<form className="gift-form" aria-label={title} onSubmit={e=>e.preventDefault()}>
   <p className="intro">Не нужно искать идеальные слова.<br/>Достаточно твоих.</p>
   <div className="field-pair"><label>Для кого<input onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();dismissInput();}}} value={name} onChange={e=>setName(e.target.value)} placeholder="Мой бусик" maxLength={40}/></label><label>От кого<input onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();dismissInput();}}} value={from} onChange={e=>setFrom(e.target.value)} placeholder="Твоё имя" maxLength={40}/></label></div>
   <label className="message-field">Твоё послание<textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder={initialMessage} maxLength={500} rows={5}/><span className="character-count">{message.length} / 500</span></label>
   <button type="button" className="small-link" onClick={()=>setMessage(initialMessage)}>Помоги начать <HeartIcon/></button>
   <div className="form-bottom"><Button onClick={()=>go('gift')} disabled={!message.trim()}>Дальше <ArrowRightIcon/></Button><p className="hint">Послание увидит только тот, кому ты его покажешь.</p></div>
  </form>}
  {screen==='gift'&&<form className="gift-form" aria-label={title} onSubmit={e=>e.preventDefault()}>
   <p className="intro">То, что можно подарить друг другу.<br/>Большое счастье в маленьких вещах.</p>
   <div className="gift-options" role="group" aria-label="Выбери подарок">{[...giftChoices,'Свой подарок'].map((g,i)=><motion.button type="button" whileTap={{scale:.975}} className={'gift-option '+(gift===g?'chosen':'')} aria-pressed={gift===g} key={g} onClick={()=>setGift(g)}><span className="gift-number">0{i+1}</span><span>{g}</span>{gift===g?<CheckIcon/>:<HeartIcon/>}</motion.button>)}</div>
   {gift==='Свой подарок'&&<label className="custom-gift">Твоё обещание<input onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();dismissInput();}}} value={customGift} onChange={e=>setCustomGift(e.target.value)} maxLength={90} placeholder="Например, спонтанное свидание"/></label>}
   <input ref={fileRef} type="file" hidden accept="image/png,image/jpeg,image/webp" onChange={e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>10*1024*1024){setPhotoError('Выбери фото до 10 МБ');return;}if(!['image/png','image/jpeg','image/webp'].includes(f.type)){setPhotoError('Подойдёт JPG, PNG или WebP');return;}if(photo)URL.revokeObjectURL(photo);setPhoto(URL.createObjectURL(f));setPhotoError('');}}/>
   <button type="button" className="photo-button" onClick={()=>fileRef.current?.click()}>{photo?<img src={photo} alt="Выбранное фото"/>:<ImageIcon/>}<span>{photo?'Фото добавлено. Заменить':'Добавить ваше фото'}<small>Необязательно · до 10 МБ</small></span><ArrowRightIcon/></button>
   {photo&&<button type="button" className="small-link" onClick={()=>{URL.revokeObjectURL(photo);setPhoto('');if(fileRef.current)fileRef.current.value='';}}>Убрать фото</button>}{photoError&&<p role="alert" className="error">{photoError}</p>}
   <div className="form-bottom"><Button onClick={()=>{setConfigIndex(0);setField('coupons',[(gift==='Свой подарок'?customGift:gift),...settings.coupons.slice(1)]);go('configure');}} disabled={gift==='Свой подарок'&&!customGift.trim()}>Собрать сюрприз <ArrowRightIcon/></Button></div>
  </form>}
  {screen==='configure'&&<form className="gift-form" aria-label={title} onSubmit={e=>e.preventDefault()}>
<div className="presentation-picker" role="group" aria-label="Оформление этапа"><span>Как подать этот этап?</span>{[true,false].map(value=><button type="button" key={String(value)} aria-pressed={settings.interactive[configIndex]===value} onClick={()=>setSettings(prev=>{const interactive=[...prev.interactive];interactive[configIndex]=value;return{...prev,interactive};})}>{value?['Фото с переворотом','Стереть секрет','Зарядить сердце','Собрать пазл','Поиск пар','Пройти тест','Отрывные купоны','Автомат свиданий'][configIndex]:['Фото с подписью','Открытая записка','Признание сразу','Целое фото','Открытые карточки','Вопросы и мои ответы','Купоны по кнопке','Готовый план'][configIndex]}</button>)}</div>
<BusikGuide text={['Давай сохраним ваши любимые моменты.','Что спрячем под сердечным покрытием?','Какое признание откроется, когда сердце наполнится?','Выбери отдельное фото для пазла или оставь первое воспоминание.','Добавь свои фото — у каждого появится пара.','Напиши вопросы и отметь ответы, которые выбрал бы ты.','Какие приятные обещания подарим?','Придумай варианты — я соберу ваш план на вечер.'][configIndex]}/>
{configIndex===0&&<>
<PhotoFields title="Фото воспоминаний" photos={memoryPhotos} onChange={next=>{setSettings(prev=>({...prev,captions:next.map((src,i)=>{const oldIndex=memoryPhotos.indexOf(src);return prev.captions[oldIndex>=0?oldIndex:i]||'';})}));setMemoryPhotos(next);}} max={5}/>{Array.from({length:Math.max(1,memoryPhotos.length||Number(!!photo))},(_,i)=><label className="config-field" key={i}>Заметка к фото {i+1}<input value={settings.captions[i]||''} maxLength={160} onChange={e=>setSettings(prev=>{const c=[...prev.captions];c[i]=e.target.value;return{...prev,captions:c};})}/></label>)}
</>}
{configIndex===1&&<label className="config-field">Твой секрет<textarea value={settings.secret} maxLength={240} rows={3} onChange={e=>setField('secret',e.target.value)}/></label>}
{configIndex===2&&<label className="config-field">Признание после 100%<textarea value={settings.heart} maxLength={240} rows={3} onChange={e=>setField('heart',e.target.value)}/></label>}
{configIndex===3&&<><PhotoFields title="Фото для пазла" photos={puzzlePhoto} onChange={setPuzzlePhoto} max={1}/><img className="puzzle-preview" src={puzzlePhoto[0]||pics[0]||'/media/busik-hero.png'} alt="Фото для пазла"/><p className="hint">Без отдельного фото возьмём первое воспоминание или Бусика. Четыре фрагмента можно перетаскивать или менять местами.</p></>}
{configIndex===4&&<><p className="intro">Добавь 2–6 разных снимков. Каждый появится на двух карточках. Без фото игра будет с символами.</p><PhotoFields title="Фото для совпадений" photos={pairPhotos} onChange={setPairPhotos}/>{pairPhotos.length===1&&<p className="field-error" role="alert">Добавь ещё хотя бы одно фото, чтобы было что искать, или удали фото для игры с символами.</p>}<p className="hint">{pairPhotos.length?`${pairPhotos.length} фото → ${pairPhotos.length*2} карточек`:'6 пар символов → 12 карточек'}. Совпавшие пары остаются открытыми.</p></>}
{configIndex===5&&<QuizEditor questions={settings.questions} onChange={value=>setField('questions',value)}/>}
{configIndex===6&&<ListFields title="Купоны с любовью" values={settings.coupons} onChange={value=>setField('coupons',value)} placeholder="Например, массаж после длинного дня"/>}
{configIndex===7&&<><p className="intro">Автомат выберет по одному варианту из каждого раздела: место, еду и занятие. Заполни отдельные поля — так получится ваш план на вечер.</p>{(['places','food','activities'] as const).map((key,i)=><ListFields key={key} title={['Где проведём вечер','Что будем есть','Чем займёмся'][i]} values={settings[key]} onChange={value=>setField(key,value)} placeholder={['Например, прогулка в парке','Например, пицца на двоих','Например, посмотреть фильм'][i]}/>)}<div className="plan-preview"><span className="eyebrow">ПРИМЕР КОМБИНАЦИИ</span><p>{[settings.places,settings.food,settings.activities].map(v=>v[0]?.trim()||'Заполни вариант').join(' · ')}</p></div></>}
<div className="form-bottom"><Button disabled={!configValid} onClick={()=>{dismissInput();if(configIndex<mechanicTitles.length-1)setConfigIndex(i=>i+1);else go('ready');}}>{configIndex===mechanicTitles.length-1?'Посмотреть подарок':'Сохранить и дальше'} <ArrowRightIcon/></Button></div>
</form>}
{screen==='play'&&<>
<BusikGuide text={['Я принёс ваши маленькие счастливые моменты.','Здесь спрятано кое-что только для тебя.','Добавим немного тепла?','Поможешь собрать один счастливый момент?','У каждой карточки есть пара. Найдём все совпадения?','Давай узнаем, как хорошо вы знаете друг друга.','Эти обещания можно забрать с собой.','А теперь выберем ваш следующий вечер вместе.'][playIndex]}/>
<div key={playIndex} className="mechanic-surface"><MechanicStage index={playIndex} settings={activeSettings} photos={pics} pairPhotos={demo?[]:pairPhotos} puzzlePhoto={(!demo&&puzzlePhoto[0])||pics[0]||'/media/busik-hero.png'} author={displayFrom} onPairsComplete={setPairsComplete} onQuizComplete={setQuizComplete}/></div>
{playIndex<mechanicTitles.length-1?<div className="form-bottom"><Button disabled={(playIndex===4&&activeSettings.interactive[4]&&!pairsComplete)||(playIndex===5&&activeSettings.interactive[5]&&!quizComplete)} onClick={()=>{setPairsComplete(false);setQuizComplete(false);setPlayIndex(i=>i+1);}}>{playIndex===6?'К автомату свиданий':'Следующий сюрприз'} <ArrowRightIcon/></Button></div>:<div className="journey-ending"><p className="hint">С любовью, {displayFrom}. Пусть впереди будет ещё много ваших моментов.</p><button type="button" className="small-link replay" onClick={()=>preview(demo)}><ReloadIcon/> Посмотреть ещё раз</button></div>}
</>}
{screen==='ready'&&<>
   <div className="small-mascot">{mascot}</div><p className="intro centered">Кому: <strong>{name.trim()||'Мой бусик'}</strong><br/>С любовью, {from.trim()||'Твой человек'}.</p>
   <Button onClick={()=>preview(false)}>Открыть свой сюрприз <ArrowRightIcon/></Button><button type="button" className="example-link" onClick={()=>go('write')}>Изменить послание</button><p className="prototype-note">Это пробная версия: можно собрать и посмотреть подарок. Публикация ссылки и оплата появятся позже.</p>
  </>}
  {screen==='recipient'&&<>
   <p className="intro centered">Кому: {displayName}<br/><span className="muted">С любовью, {displayFrom}</span></p>
   <motion.button type="button" className="mascot-stage recipient-mascot" aria-label="Открыть письмо" whileTap={{scale:.95,rotate:-2}} onClick={()=>go('letter')}>{mascot}</motion.button>
   <Button onClick={()=>go('letter')}>Открыть сюрприз <HeartIcon/></Button><p className="hint">Здесь кое-кто очень тебя любит.</p>
  </>}
  {screen==='letter'&&<>
   <motion.article className="personal-letter" initial={{rotate:reduce?0:-3,scale:.95,opacity:0}} animate={{rotate:0,scale:1,opacity:1}} transition={{type:'spring',stiffness:200,damping:23}}>
    <PersonalLetterContent to={displayName} from={displayFrom} message={displayMessage} photo={!demo?photo:''}/>
   </motion.article><Button onClick={()=>go('play')}>К маленьким сюрпризам <ArrowRightIcon/></Button>
  </>}

 </>}
 </main>{constructing&&<aside className="live-preview" aria-label="Предпросмотр текущего этапа"><div className="live-preview-header"><div><span className="eyebrow">ПРЕДПРОСМОТР</span><h2>Так увидит получатель</h2></div><button type="button" className="icon-button" aria-label="Начать предпросмотр заново" onClick={()=>setPreviewReset(n=>n+1)}><ReloadIcon/></button></div>{previewContent}<p className="preview-footnote">Обновляется по мере заполнения · можно нажимать</p></aside>}</div></motion.div></AnimatePresence>
 <Dialog.Root open={previewOpen&&constructing} onOpenChange={setPreviewOpen}><Dialog.Portal><Dialog.Overlay className="help-overlay"/><Dialog.Content className="busik-app preview-dialog" onCloseAutoFocus={e=>{e.preventDefault();previewTriggerRef.current?.focus();}} aria-describedby="preview-description"><div className="live-preview-header"><div><Dialog.Title className="preview-dialog-title">Предпросмотр</Dialog.Title><Dialog.Description id="preview-description">Текущий этап глазами получателя</Dialog.Description></div><div className="preview-dialog-actions"><button type="button" className="icon-button" aria-label="Начать предпросмотр заново" onClick={()=>setPreviewReset(n=>n+1)}><ReloadIcon/></button><Dialog.Close className="icon-button" aria-label="Закрыть предпросмотр"><Cross2Icon/></Dialog.Close></div></div>{previewContent}</Dialog.Content></Dialog.Portal></Dialog.Root>
 <Dialog.Root open={help} onOpenChange={setHelp}><Dialog.Portal><Dialog.Overlay className="help-overlay"/><Dialog.Content className="help-dialog" aria-describedby="help-description"><Dialog.Close className="icon-button help-close" aria-label="Закрыть"><Cross2Icon/></Dialog.Close><Dialog.Title className="inner-title">Маленький подарок.<br/>Просто так.</Dialog.Title><Dialog.Description id="help-description" className="intro">Три шага — и твои слова станут сюрпризом.</Dialog.Description><div className="how-content"><ol><li><b>Напиши от сердца</b><p>Имя, пара тёплых слов — можно начать с нашей подсказки.</p></li><li><b>Добавь маленький подарок</b><p>Ваше фото и обещание приятного момента вместе.</p></li><li><b>Посмотри, как получилось</b><p>Бусик бережно передаст твоё послание.</p></li></ol><Button onClick={()=>{setHelp(false);start();}}>Попробовать <ArrowRightIcon/></Button></div></Dialog.Content></Dialog.Portal></Dialog.Root>
 </div></MotionConfig>;
}
