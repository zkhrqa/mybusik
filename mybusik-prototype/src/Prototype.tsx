import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react';
import { ArrowRightIcon, ArrowLeftIcon, HeartIcon, CheckIcon, Cross2Icon, ImageIcon, ReloadIcon } from '@radix-ui/react-icons';
import { MobileScroll, KeyboardInput, KeyboardTextarea, BottomSheet, Carousel, useKeyboard, useKeyboardInsets } from './mobile';
import '@fontsource/cormorant-garamond/cyrillic-700.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/manrope/cyrillic-400.css';
import '@fontsource/manrope/cyrillic-600.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';

type Screen = 'home' | 'write' | 'gift' | 'configure' | 'play' | 'ready' | 'recipient' | 'letter' | 'present';
const giftChoices = ['Завтрак в постель', 'Вечер только для нас', 'Обниматься сколько угодно'];
const initialMessage = 'Ты — моё любимое совпадение. Спасибо, что рядом с тобой даже самый обычный день становится особенным.';
function Brand() { return <span className="brand-crop"><img src="/media/selected-reference.png" alt="mybusik" draggable={false} /></span>; }
function Button({ children, onClick, disabled = false, secondary = false }: {children:React.ReactNode;onClick:()=>void;disabled?:boolean;secondary?:boolean}) {
 return <motion.button className={secondary?'secondary-button':'primary-button'} onClick={onClick} disabled={disabled} whileTap={{scale:.965}} transition={{type:'spring',stiffness:460,damping:24}}>{children}</motion.button>;
}
const mechanicTitles=['Наши воспоминания','Секрет для тебя','Заряди сердце','Собери наш момент','Автомат свиданий','Купоны с любовью'];
type Settings={interactive:boolean[];captions:string[];secret:string;heart:string;places:string;food:string;activities:string;coupons:string};
const defaultSettings:Settings={interactive:[true,true,true,true,true,true],captions:['Наш маленький счастливый момент','Помнишь, как мы смеялись?','Хочу ещё много таких дней'],secret:'Моё любимое место — рядом с тобой.',heart:'Ты делаешь мой мир теплее.',places:'Уютный вечер дома\nПикник у озера\nПрогулка по городу',food:'Пицца на двоих\nЛюбимый десерт\nДомашний ужин',activities:'Фильм без телефонов\nТанцы на кухне\nГоворить обо всём',coupons:'Обниматься сколько угодно\nМассаж после длинного дня\nПрогулка в твоё любимое место'};
const lines=(value:string)=>value.split('\n').map(v=>v.trim()).filter(Boolean).slice(0,5);
function Celebration({id}:{id:number}) {
 const reduce=useReducedMotion();
 if(!id||reduce)return null;
 return <div className="celebration" aria-hidden="true" key={id}>{Array.from({length:12},(_,i)=><motion.span key={i} initial={{x:0,y:0,opacity:1,scale:.5}} animate={{x:Math.cos(i*Math.PI/6)*110,y:Math.sin(i*Math.PI/6)*100-60,opacity:0,scale:1.2,rotate:i*35}} transition={{duration:.85,ease:'easeOut'}}>♥</motion.span>)}</div>;
}
function StageProgress({current,total,label}:{current:number;total:number;label:string}) {
 return <div className="journey-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current} aria-label={label}><div className="journey-label"><span>{label}</span><span>{current} / {total}</span></div><div className="journey-segments">{Array.from({length:total},(_,i)=><span key={i} className={i<current?'filled':''}/>)}</div></div>;
}
function BusikGuide({text}:{text:string}) {return <aside className="busik-guide"><img src="/media/busik-hero.png" alt=""/><p><b>Бусик рядом</b>{text}</p></aside>;}
function MemoryGame({photos,captions,interactive=true}:{photos:string[];captions:string[];interactive?:boolean}) {
 const [flipped,setFlipped]=useState<number[]>([]);
 const pics=photos.length?photos:['/media/busik-hero.png'];
 return <><p className="intro">{interactive?'Листай наши моменты. Нажми на фото — там кое-что написано.':'Наши фотографии и маленькие истории.'}</p><Carousel className="memories-carousel" contentClassName="memories-track" ariaLabel="Фото-воспоминания">{pics.map((p,i)=><button key={i} className="polaroid" aria-label={'Перевернуть воспоминание '+(i+1)} aria-pressed={flipped.includes(i)} onClick={()=>interactive&&setFlipped(prev=>prev.includes(i)?prev.filter(n=>n!==i):[...prev,i])}>{flipped.includes(i)?<div className="photo-back"><HeartIcon/><p>{captions[i]||'Мой любимый момент — любой, где есть ты.'}</p></div>:<img src={p} alt={'Воспоминание '+(i+1)} draggable={false}/>}<span>{i+1} / {pics.length} · {interactive?(flipped.includes(i)?'Вернуть фото':'Переверни меня'):captions[i]||'Наш счастливый момент'}</span></button>)}</Carousel><p className="hint">{photos.length?'Ваши фотографии, ваши маленькие истории.':'Пока здесь Бусик. Автор может добавить свои фото.'}</p></>;
}
function ScratchGame({secret,interactive=true}:{secret:string;interactive?:boolean}) {
 const ref=useRef<HTMLCanvasElement>(null);const drawing=useRef(false);const prev=useRef<{x:number;y:number}|null>(null);const [opened,setOpened]=useState(!interactive);const [progress,setProgress]=useState(0);
 useEffect(()=>{const c=ref.current;const ctx=c?.getContext('2d');if(!ctx||!c)return;ctx.fillStyle='#c796ad';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#fff5f2';ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText('Сотри сердечный секрет',c.width/2,c.height/2);},[]);
 const point=(e:React.PointerEvent<HTMLCanvasElement>)=>{const c=e.currentTarget,r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height};};
 const erase=(e:React.PointerEvent<HTMLCanvasElement>)=>{const c=e.currentTarget,ctx=c.getContext('2d');if(!ctx)return;const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.lineWidth=34;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(prev.current?.x??p.x,prev.current?.y??p.y);ctx.lineTo(p.x,p.y);ctx.stroke();prev.current=p;};
 const measure=()=>{const c=ref.current,ctx=c?.getContext('2d');if(!ctx||!c)return;const pixels=ctx.getImageData(0,0,c.width,c.height).data;let clear=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]<128)clear++;const n=Math.round(clear/(c.width*c.height)*100);setProgress(n);if(n>=45)setOpened(true);};
 return <><p className="intro">{interactive?'Проведи пальцем или мышью по покрытию.':'Записка только для тебя.'}</p><div className="scratch-card"><div className="secret-content"><HeartIcon/><p>{secret}</p></div>{!opened&&<canvas ref={ref} width={300} height={210} data-scroll-drag="ignore" aria-label="Покрытие секретной открытки" onPointerDown={e=>{drawing.current=true;prev.current=null;e.currentTarget.setPointerCapture(e.pointerId);erase(e);}} onPointerMove={e=>{if(drawing.current)erase(e);}} onPointerUp={()=>{drawing.current=false;prev.current=null;measure();}} onPointerCancel={()=>{drawing.current=false;prev.current=null;}}/>}<Celebration id={opened?1:0}/></div><p className="hint" role="status">{opened?'Секрет открыт ♥':`Стёрто ${progress}% · после 45% откроется всё`}</p>{!opened&&<button className="small-link" onClick={()=>setOpened(true)}>Открыть без стирания</button>}</>;
}
function HeartGame({text,interactive=true}:{text:string;interactive?:boolean}) {
 const [taps,setTaps]=useState(interactive?0:10);const full=taps>=10;
 return <><p className="intro centered">Каждое касание — немного тепла.</p><div className="heart-game"><motion.button aria-label="Зарядить сердце" disabled={full} onClick={()=>setTaps(t=>Math.min(10,t+1))} whileTap={{scale:.88}} className={'charge-heart '+(full?'complete':'')}><span className="heart-symbol" aria-hidden="true">♥</span><span>{taps*10}%</span></motion.button><Celebration id={taps}/></div><div className="charge-meter" role="progressbar" aria-label="Заряд любви" aria-valuenow={taps*10} aria-valuemin={0} aria-valuemax={100}><motion.div animate={{scaleX:taps/10}}/></div><p className="heart-message" role="status">{full?text:'Бусик бережёт для тебя ещё одно признание.'}</p>{!full&&<button className="small-link" onClick={()=>setTaps(10)}>Раскрыть сразу</button>}</>;
}
function PuzzleGame({photo,interactive=true}:{photo:string;interactive?:boolean}) {
 const [pieces,setPieces]=useState(interactive?[2,0,3,1]:[0,1,2,3]);const [selected,setSelected]=useState<number|null>(null);const [dragOrigin,setDragOrigin]=useState<number|null>(null);const board=useRef<HTMLDivElement>(null);const suppress=useRef(false);const solved=pieces.every((p,i)=>p===i);
 const swap=(a:number,b:number)=>setPieces(prev=>{const next=[...prev];[next[a],next[b]]=[next[b],next[a]];return next;});
 const choose=(i:number)=>{if(suppress.current){suppress.current=false;return;}if(solved)return;if(selected===null)setSelected(i);else{swap(selected,i);setSelected(null);}};
 return <><p className="intro">{interactive?'Перетащи фрагмент на другой или нажми на два кусочка, чтобы поменять их местами.':'Один из ваших счастливых моментов.'}</p><div ref={board} className={'puzzle-board '+(solved?'solved':'')} data-scroll-drag="ignore">{pieces.map((piece,i)=><motion.button key={i} aria-label={'Фрагмент '+(i+1)} aria-pressed={selected===i} className={selected===i?'selected':''} style={{backgroundImage:`url("${photo}")`,backgroundPosition:`${piece%2*100}% ${Math.floor(piece/2)*100}%`}} drag={!solved} dragSnapToOrigin dragElastic={.15} onDragStart={()=>{setDragOrigin(i);suppress.current=true;}} onDragEnd={(_,info)=>{const r=board.current?.getBoundingClientRect();if(r&&dragOrigin!==null){const x=info.point.x-r.left,y=info.point.y-r.top;if(x>=0&&y>=0&&x<r.width&&y<r.height)swap(dragOrigin,Math.floor(y/(r.height/2))*2+Math.floor(x/(r.width/2)));}setDragOrigin(null);setSelected(null);}} onClick={()=>choose(i)}><span className="piece-number">{i+1}</span></motion.button>)}<Celebration id={solved?1:0}/></div><p className="hint" role="status">{solved?'Наш момент снова вместе ♥':selected===null?'Четыре кусочка одного счастливого момента.':'Теперь выбери второй фрагмент.'}</p>{!solved&&<button className="small-link" onClick={()=>{setPieces([0,1,2,3]);setSelected(null);}}>Показать целое фото</button>}</>;
}
function DateGame({settings,interactive=true}:{settings:Settings;interactive?:boolean}) {
 const options=[lines(settings.places),lines(settings.food),lines(settings.activities)];const [result,setResult]=useState<string[]>(interactive?[]:[lines(settings.places)[0],lines(settings.food)[0],lines(settings.activities)[0]]);const [spin,setSpin]=useState(0);const [tick,setTick]=useState(0);const [running,setRunning]=useState(false);const [accepted,setAccepted]=useState(false);const reduce=useReducedMotion();
 useEffect(()=>{if(!running)return;const interval=setInterval(()=>setTick(t=>t+1),80);const timer=setTimeout(()=>{setResult(options.map(o=>o[Math.floor(Math.random()*o.length)]||'Время вдвоём'));setRunning(false);},reduce?0:1100);return()=>{clearInterval(interval);clearTimeout(timer);};},[running,spin]);
 return <><p className="intro centered">Один запуск — ваш план на вечер.</p><div className="date-machine">{['Где','Что вкусного','Чем займёмся'].map((label,i)=><div className="date-reel" key={label}><span>{label}</span><motion.p key={running?tick:result[i]} initial={{y:reduce?0:12,opacity:.4}} animate={{y:0,opacity:1}}>{running?(options[i][tick%options[i].length]||'Время вдвоём'):result[i]||'♥ ♥ ♥'}</motion.p></div>)}<Celebration id={!running?spin:0}/></div>{interactive&&<Button disabled={running||accepted} onClick={()=>{setSpin(s=>s+1);setRunning(true);setAccepted(false);}}>{running?'Бусик крутит барабаны…':result.length?'Ещё один вариант':'Запустить автомат'}</Button>}{result.length>0&&!running&&<><button className="example-link" disabled={accepted} onClick={()=>setAccepted(true)}>{accepted?'Договорились ♥':'Принять план на вечер'}</button><p className="hint" role="status">{accepted?'План принят в предпросмотре. Уведомления подключим вместе с сервером.':'Можно принять план или попробовать другую комбинацию.'}</p></>}</>;
}
function CouponGame({coupons,interactive=true}:{coupons:string[];interactive?:boolean}) {
 const [saved,setSaved]=useState<number[]>([]);const [requests,setRequests]=useState<number[]>([]);
 const save=(i:number)=>setSaved(prev=>prev.includes(i)?prev:[...prev,i]);
 return <><p className="intro">{interactive?'Потяни билет вправо за пунктирный край или нажми «Забрать».':'Выбери обещание и сохрани его в коллекцию.'}</p><div className="love-coupons">{coupons.map((text,i)=><div className={'tear-coupon '+(saved.includes(i)?'saved':'')} key={i}><motion.div className="ticket-content" data-scroll-drag="ignore" drag={!interactive||saved.includes(i)?false:'x'} dragConstraints={{left:0,right:0}} dragElastic={.8} onDragEnd={(_,info)=>{if(info.offset.x>65)save(i);}}><span className="eyebrow">КУПОН 0{i+1}</span><h2>{text}</h2><div className="perforation" aria-hidden="true"/></motion.div>{saved.includes(i)?<><span className="ticket-status"><CheckIcon/> В твоей коллекции</span><button className="small-link" disabled={requests.includes(i)} onClick={()=>setRequests(prev=>[...prev,i])}>{requests.includes(i)?'Хочу воспользоваться ♥':'Хочу воспользоваться'}</button></>:<button className="small-link" onClick={()=>save(i)}>Забрать купон {i+1}</button>}</div>)}</div><p className="hint" role="status">Сохранено {saved.length} из {coupons.length}. Ответы пока остаются в этом предпросмотре.</p><Celebration id={saved.length}/></>;
}

export default function Prototype() {
 const [screen,setScreen]=useState<Screen>('home'); const [help,setHelp]=useState(false);
 const [name,setName]=useState(''); const [from,setFrom]=useState(''); const [message,setMessage]=useState('');
 const [gift,setGift]=useState(giftChoices[0]); const [customGift,setCustomGift]=useState('');
 const [settings,setSettings]=useState<Settings>(defaultSettings);const [configIndex,setConfigIndex]=useState(0);const [playIndex,setPlayIndex]=useState(0);const [memoryPhotos,setMemoryPhotos]=useState<string[]>([]);const galleryRef=useRef<HTMLInputElement>(null);
 const [photo,setPhoto]=useState(''); const [photoError,setPhotoError]=useState('');
 const [demo,setDemo]=useState(false); const [revealed,setRevealed]=useState(false); const [hug,setHug]=useState(false); const [bump,setBump]=useState(0);
 const fileRef=useRef<HTMLInputElement>(null); const keyboard=useKeyboard(); const reduce=useReducedMotion(); const {bottomInset}=useKeyboardInsets();
 const appRef=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const viewport=appRef.current?.closest('[data-testid="device-screen"]');
  const restore=()=>{if(viewport&&(viewport.scrollTop||viewport.scrollLeft))viewport.scrollTo(0,0);};
  restore();viewport?.addEventListener('scroll',restore);
  return ()=>viewport?.removeEventListener('scroll',restore);
 },[keyboard.visible,screen]);
 const go=(next:Screen)=>{keyboard.hide();setScreen(next);};
 const start=()=>{setDemo(false);go('write');};
 const preview=(example=false)=>{setDemo(example);setPlayIndex(0);setRevealed(false);setHug(false);go('recipient');};
 const displayName=demo?'Мой бусик':name.trim()||'Мой бусик';
 const displayFrom=demo?'Твой человек':from.trim()||'Твой человек';
 const displayMessage=demo?initialMessage:message.trim()||initialMessage;
 const displayGift=demo?'Вечер только для нас':gift==='Свой подарок'?customGift.trim():gift;
 const activeSettings=demo?defaultSettings:settings;const pics=demo?[]:memoryPhotos.length?memoryPhotos:photo?[photo]:[];
 const setField=(key:'secret'|'heart'|'places'|'food'|'activities'|'coupons',value:string)=>setSettings(prev=>({...prev,[key]:value}));
 const configValid=configIndex===1?!!settings.secret.trim():configIndex===2?!!settings.heart.trim():configIndex===4?[settings.places,settings.food,settings.activities].every(v=>lines(v).length>0):configIndex===5?lines(settings.coupons).length>0:true;
 const back=()=>{if(screen==='configure'&&configIndex>0){keyboard.hide();setConfigIndex(i=>i-1);return;}if(screen==='play'&&playIndex>0){setPlayIndex(i=>i-1);return;}go(screen==='write'?'home':screen==='gift'?'write':screen==='configure'?'gift':screen==='ready'?'configure':screen==='recipient'?demo?'home':'ready':screen==='play'?'recipient':screen==='letter'?'play':'letter');};
 const title=screen==='configure'?mechanicTitles[configIndex]:screen==='play'?mechanicTitles[playIndex]:screen==='write'?'Пару слов от сердца':screen==='gift'?'И маленький подарок':screen==='ready'?'Всё готово, с любовью':screen==='recipient'?'Тебе кое-что передали':screen==='letter'?displayName:'Ещё кое-что для тебя';
 const mascot=<motion.img key={bump} className="mascot" src="/media/busik-hero.png" alt="Бусик держит письмо для тебя" draggable={false} animate={bump&&!reduce?{rotate:[0,-3,3,0],scale:[1,.97,1.025,1]}:{}} transition={{duration:.65}}/>;
 return <MotionConfig reducedMotion="user"><div ref={appRef} className="busik-app" onBlurCapture={e=>{ if((e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && !(e.relatedTarget instanceof HTMLInputElement || e.relatedTarget instanceof HTMLTextAreaElement)) keyboard.hide(); }}>
 <AnimatePresence mode="wait" initial={false}><motion.div className="page-layer" key={screen} initial={{opacity:0,y:reduce?0:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduce?0:-8}} transition={{duration:.2}}>
 {screen!=='home'&&<StageProgress current={screen==='write'?1:screen==='gift'?2:screen==='configure'?configIndex+3:screen==='ready'?9:screen==='recipient'?1:screen==='play'?playIndex+2:screen==='letter'?8:9} total={9} label={['write','gift','configure','ready'].includes(screen)?'Собираем твой сюрприз':'История для тебя'}/>}
 {screen!=='home'&&<header className="inner-header"><button className="icon-button" aria-label="Назад" onClick={back}><ArrowLeftIcon/></button><Brand/><button className="icon-button" aria-label="На главную" onClick={()=>go('home')}><Cross2Icon/></button></header>}
 <MobileScroll key={screen+'-'+configIndex+'-'+playIndex} className={'busik-scroll '+(screen!=='home'?'with-journey':'')}><main className={screen==='home'?'home-page':'inner-page'}>
 {screen==='home'?<>
  <header className="home-header"><Brand/><button className="how-link" onClick={()=>setHelp(true)}>Как это работает <ArrowRightIcon/></button></header>
  <section className="hero-copy"><h1>Порадуй своего<br/>бусика <HeartIcon className="title-heart"/></h1><p>Маленький сюрприз.<br/>Просто потому что люблю.</p></section>
  <button className="mascot-stage" onClick={()=>setBump(n=>n+1)} aria-label="Погладить Бусика">{mascot}</button>
  <div className="home-actions"><Button onClick={start}>Создать сюрприз <ArrowRightIcon/></Button><button className="example-link" onClick={()=>preview(true)}>Посмотреть пример</button><p className="home-note"><HeartIcon/> Свои слова, фото и немного волшебства</p></div>
 </>:<>

  {['write','gift','ready'].includes(screen)&&<div className="step-label">{screen==='write'?'01 / Личные слова':screen==='gift'?'02 / Маленький подарок':'09 / Предпросмотр'}<span>Твой сюрприз</span></div>}
  {['recipient','letter','present'].includes(screen)&&<div className="preview-label">{demo?'Пример сюрприза':'Предпросмотр для получателя'}</div>}
  <h1 className="inner-title">{title}</h1>
  {screen==='write'&&<>
   <p className="intro">Не нужно искать идеальные слова.<br/>Достаточно твоих.</p>
   <div className="field-pair"><label>Для кого<KeyboardInput onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();keyboard.hide();}}} value={name} onChange={e=>setName(e.target.value)} placeholder="Мой бусик" maxLength={40}/></label><label>От кого<KeyboardInput onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();keyboard.hide();}}} value={from} onChange={e=>setFrom(e.target.value)} placeholder="Твоё имя" maxLength={40}/></label></div>
   <label className="message-field">Твоё послание<KeyboardTextarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Что ты давно хотел сказать?" maxLength={500} rows={5}/><span className="character-count">{message.length} / 500</span></label>
   <button className="small-link" onClick={()=>setMessage(initialMessage)}>Помоги начать <HeartIcon/></button>
   <div className="form-bottom"><Button onClick={()=>go('gift')} disabled={!message.trim()}>Дальше <ArrowRightIcon/></Button><p className="hint">Послание увидит только тот, кому ты его покажешь.</p></div>
  </>}
  {screen==='gift'&&<>
   <p className="intro">То, что можно подарить друг другу.<br/>Большое счастье в маленьких вещах.</p>
   <div className="gift-options" role="group" aria-label="Выбери подарок">{[...giftChoices,'Свой подарок'].map((g,i)=><motion.button whileTap={{scale:.975}} className={'gift-option '+(gift===g?'chosen':'')} aria-pressed={gift===g} key={g} onClick={()=>setGift(g)}><span className="gift-number">0{i+1}</span><span>{g}</span>{gift===g?<CheckIcon/>:<HeartIcon/>}</motion.button>)}</div>
   {gift==='Свой подарок'&&<label className="custom-gift">Твоё обещание<KeyboardInput onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();keyboard.hide();}}} value={customGift} onChange={e=>setCustomGift(e.target.value)} maxLength={90} placeholder="Например, спонтанное свидание"/></label>}
   <input ref={fileRef} type="file" hidden accept="image/png,image/jpeg,image/webp" onChange={e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>10*1024*1024){setPhotoError('Выбери фото до 10 МБ');return;}if(!['image/png','image/jpeg','image/webp'].includes(f.type)){setPhotoError('Подойдёт JPG, PNG или WebP');return;}if(photo)URL.revokeObjectURL(photo);setPhoto(URL.createObjectURL(f));setPhotoError('');}}/>
   <button className="photo-button" onClick={()=>fileRef.current?.click()}>{photo?<img src={photo} alt="Выбранное фото"/>:<ImageIcon/>}<span>{photo?'Фото добавлено. Заменить':'Добавить ваше фото'}<small>Необязательно · до 10 МБ</small></span><ArrowRightIcon/></button>
   {photo&&<button className="small-link" onClick={()=>{URL.revokeObjectURL(photo);setPhoto('');if(fileRef.current)fileRef.current.value='';}}>Убрать фото</button>}{photoError&&<p role="alert" className="error">{photoError}</p>}
   <div className="form-bottom"><Button onClick={()=>{setConfigIndex(0);setField('coupons',(gift==='Свой подарок'?customGift:gift)+'\n'+lines(settings.coupons).slice(1).join('\n'));go('configure');}} disabled={gift==='Свой подарок'&&!customGift.trim()}>Собрать сюрприз <ArrowRightIcon/></Button></div>
  </>}
  {screen==='configure'&&<>
<div className="presentation-picker" role="group" aria-label="Оформление этапа"><span>Как подать этот этап?</span>{[true,false].map(value=><button key={String(value)} aria-pressed={settings.interactive[configIndex]===value} onClick={()=>setSettings(prev=>{const interactive=[...prev.interactive];interactive[configIndex]=value;return{...prev,interactive};})}>{value?['Фото с переворотом','Стереть секрет','Зарядить сердце','Собрать пазл','Автомат свиданий','Отрывные купоны'][configIndex]:['Фото с подписью','Открытая записка','Признание сразу','Целое фото','Готовый план','Купоны по кнопке'][configIndex]}</button>)}</div>
<BusikGuide text={['Давай сохраним ваши любимые моменты.','Что спрячем под сердечным покрытием?','Какое признание откроется, когда сердце наполнится?','Для пазла возьму первое фото воспоминаний.','Придумай варианты — я соберу ваш план на вечер.','Какие приятные обещания подарим?'][configIndex]}/>
{configIndex===0&&<>
<input ref={galleryRef} type="file" hidden multiple accept="image/png,image/jpeg,image/webp" onChange={e=>{const fs=Array.from(e.target.files||[]);if(fs.length>5){setPhotoError('Выбери до 5 фото');return;}if(fs.some(f=>f.size>10*1024*1024||!['image/png','image/jpeg','image/webp'].includes(f.type))){setPhotoError('Подойдут JPG, PNG или WebP до 10 МБ каждый');return;}memoryPhotos.forEach(URL.revokeObjectURL);setMemoryPhotos(fs.map(f=>URL.createObjectURL(f)));setPhotoError('');}}/>
<button className="photo-button" onClick={()=>galleryRef.current?.click()}><ImageIcon/><span>{memoryPhotos.length?`Добавлено фото: ${memoryPhotos.length}. Заменить`:'Добавить 1–5 ваших фото'}<small>Фото 1 станет пазлом · можно продолжить с Бусиком</small></span></button>
{memoryPhotos.length>0&&<button className="small-link" onClick={()=>{memoryPhotos.forEach(URL.revokeObjectURL);setMemoryPhotos([]);}}>Убрать фото воспоминаний</button>}
{photoError&&<p role="alert" className="error">{photoError}</p>}
{Array.from({length:Math.max(1,memoryPhotos.length||Number(!!photo))},(_,i)=><label className="config-field" key={i}>Заметка к фото {i+1}<KeyboardInput value={settings.captions[i]||''} maxLength={160} onChange={e=>setSettings(prev=>{const c=[...prev.captions];c[i]=e.target.value;return{...prev,captions:c};})}/></label>)}
</>}
{configIndex===1&&<label className="config-field">Твой секрет<KeyboardTextarea value={settings.secret} maxLength={240} rows={3} onChange={e=>setField('secret',e.target.value)}/></label>}
{configIndex===2&&<label className="config-field">Признание после 100%<KeyboardTextarea value={settings.heart} maxLength={240} rows={3} onChange={e=>setField('heart',e.target.value)}/></label>}
{configIndex===3&&<><img className="puzzle-preview" src={pics[0]||'/media/busik-hero.png'} alt="Фото для пазла"/><p className="hint">Четыре крупных фрагмента. Их можно перетаскивать или менять местами нажатием.</p></>}
{configIndex===4&&(['places','food','activities'] as const).map((key,i)=><label className="config-field" key={key}>{['Где проведём вечер','Что будем есть','Чем займёмся'][i]}<KeyboardTextarea value={settings[key]} maxLength={350} rows={3} onChange={e=>setField(key,e.target.value)}/><span className="hint">Каждый вариант с новой строки · до 5</span></label>)}
{configIndex===5&&<label className="config-field">Твои купоны<KeyboardTextarea value={settings.coupons} maxLength={500} rows={5} onChange={e=>setField('coupons',e.target.value)}/><span className="hint">Каждое обещание с новой строки · до 5</span></label>}
<div className="form-bottom"><Button disabled={!configValid} onClick={()=>{keyboard.hide();if(configIndex<5)setConfigIndex(i=>i+1);else go('ready');}}>{configIndex===5?'Посмотреть подарок':'Сохранить и дальше'} <ArrowRightIcon/></Button></div>
</>}
{screen==='play'&&<>
<BusikGuide text={['Я принёс ваши маленькие счастливые моменты.','Здесь спрятано кое-что только для тебя.','Добавим немного тепла?','Поможешь собрать один счастливый момент?','Давай узнаем, каким будет ваш вечер.','Эти обещания можно забрать с собой.'][playIndex]}/>
<div key={playIndex} className="mechanic-surface">{playIndex===0?<MemoryGame photos={pics} captions={activeSettings.captions} interactive={activeSettings.interactive[0]}/>:playIndex===1?<ScratchGame secret={activeSettings.secret} interactive={activeSettings.interactive[1]}/>:playIndex===2?<HeartGame text={activeSettings.heart} interactive={activeSettings.interactive[2]}/>:playIndex===3?<PuzzleGame photo={pics[0]||'/media/busik-hero.png'} interactive={activeSettings.interactive[3]}/>:playIndex===4?<DateGame settings={activeSettings} interactive={activeSettings.interactive[4]}/>:<CouponGame coupons={lines(activeSettings.coupons)} interactive={activeSettings.interactive[5]}/>}</div>
<div className="form-bottom"><Button onClick={()=>{if(playIndex<5)setPlayIndex(i=>i+1);else go('letter');}}>{playIndex===5?'Прочитать личное письмо':'Следующий сюрприз'} <ArrowRightIcon/></Button></div>
</>}
{screen==='ready'&&<>
   <div className="small-mascot">{mascot}</div><p className="intro centered">Кому: <strong>{name.trim()||'Мой бусик'}</strong><br/>С любовью, {from.trim()||'Твой человек'}.</p>
   <Button onClick={()=>preview(false)}>Открыть свой сюрприз <ArrowRightIcon/></Button><button className="example-link" onClick={()=>go('write')}>Изменить послание</button><p className="prototype-note">Это пробная версия: можно собрать и посмотреть подарок. Публикация ссылки и оплата появятся позже.</p>
  </>}
  {screen==='recipient'&&<>
   <p className="intro centered">Кому: {displayName}<br/><span className="muted">С любовью, {displayFrom}</span></p>
   <motion.button className="mascot-stage recipient-mascot" aria-label="Открыть письмо" whileTap={{scale:.95,rotate:-2}} onClick={()=>go('play')}>{mascot}</motion.button>
   <Button onClick={()=>go('play')}>Открыть сюрприз <HeartIcon/></Button><p className="hint">Здесь кое-кто очень тебя любит.</p>
  </>}
  {screen==='letter'&&<>
   <motion.article className="personal-letter" initial={{rotate:reduce?0:-3,scale:.95,opacity:0}} animate={{rotate:0,scale:1,opacity:1}} transition={{type:'spring',stiffness:200,damping:23}}>
    <HeartIcon className="letter-heart"/>{!demo&&photo&&<img className="personal-photo" src={photo} alt="Ваше общее воспоминание"/>}<p>{displayMessage}</p><span className="signature">С любовью, {displayFrom}</span>
   </motion.article><Button onClick={()=>go('present')}>А ещё у меня есть подарок <ArrowRightIcon/></Button>
  </>}
  {screen==='present'&&<>
   <p className="intro centered">Маленькое обещание.<br/>Большой повод улыбнуться.</p>
   <AnimatePresence mode="wait">{!revealed?<motion.button key="sealed" className="sealed-gift" onClick={()=>setRevealed(true)} whileTap={{scale:.96}} exit={{opacity:0,rotate:reduce?0:-8,y:reduce?0:-25}}><img src="/media/busik-hero.png" alt="Бусик с подарком"/><span>Нажми, чтобы раскрыть</span><ArrowRightIcon/></motion.button>:<motion.div key="revealed" className="coupon" initial={{scale:reduce?1:.8,rotate:reduce?0:4,opacity:0}} animate={{scale:1,rotate:0,opacity:1}} transition={{type:'spring',damping:17,stiffness:200}}><HeartIcon/><span className="eyebrow">ПОДАРОК ДЛЯ ТЕБЯ</span><h2>{displayGift}</h2><p>Когда захочешь — просто напомни.<br/>Твой человек уже всё придумал.</p><span className="coupon-signature">{displayFrom}</span></motion.div>}</AnimatePresence>
   {revealed&&<><Button onClick={()=>setHug(true)} disabled={hug}>{hug?<><CheckIcon/> Обнимаю в ответ</>:<>Обнять в ответ <HeartIcon/></>}</Button><p className="hint" role="status">{hug?'В настоящем сюрпризе автор получит твоё объятие.':'Одно нажатие, много тепла.'}</p><button className="example-link" onClick={start}>Собрать свой сюрприз</button></>}
   <button className="small-link replay" onClick={()=>preview(demo)}><ReloadIcon/> Посмотреть ещё раз</button>
  </>}
 </>}
 </main></MobileScroll></motion.div></AnimatePresence>
 {keyboard.visible&&<div className="keyboard-actions" style={{bottom:bottomInset}}><button onClick={()=>keyboard.hide()}>Готово <CheckIcon/></button></div>}
 <BottomSheet open={help} onOpenChange={setHelp} title="Маленький подарок. Просто так." description="Три шага — и твои слова станут сюрпризом." snap={.68}><div className="how-content"><ol><li><b>Напиши от сердца</b><p>Имя, пара тёплых слов — можно начать с нашей подсказки.</p></li><li><b>Добавь маленький подарок</b><p>Ваше фото и обещание приятного момента вместе.</p></li><li><b>Посмотри, как получилось</b><p>Бусик бережно передаст твоё послание.</p></li></ol><Button onClick={()=>{setHelp(false);start();}}>Попробовать <ArrowRightIcon/></Button></div></BottomSheet>
 </div></MotionConfig>;
}
