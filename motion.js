/* GSAP ScrollTrigger + Lenis / native-window scroll, progressive enhancement. */
(() => {
  const entry = document.querySelector('.entry-story');
  const hero = document.querySelector('#home-hero');
  entry?.querySelector('[data-entry-skip]').addEventListener('click', () => {
    hero?.scrollIntoView({behavior:'instant',block:'start'});
    hero?.focus({preventScroll:true});
  });
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  let lenis, tick;
  const progress = document.querySelector('[data-reading-progress]');
  const storyLabels = ['01 / Source references','02 / Candidate identity match','03 / Human ownership','04 / Scope & review date','05 / Evidence & next action'];
  const storyTargets = ['.record-evidence','.story-principal,.story-role','.story-owner','.story-scope,.story-attest','.record-evidence'];

  media.add({wide:'(min-width: 1000px)',reduce:'(prefers-reduced-motion: reduce)',small:'(max-width: 999px)'}, context => {
    const {wide,reduce} = context.conditions;
    if (reduce) return;
    if (window.Lenis) {
      lenis = new Lenis({autoRaf:false,smoothWheel:true,syncTouch:false,duration:1.05,anchors:{offset:-100},prevent:node=>Boolean(node.closest('.nav-links.open,.mega-menu,.compact-menu,textarea,select,[role="tablist"]'))});
      lenis.on('scroll', ScrollTrigger.update);
      tick = time => lenis.raf(time*1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    if (progress) gsap.to(progress,{scaleX:1,ease:'none',scrollTrigger:{trigger:document.documentElement,start:0,end:'max',scrub:true}});
    let entryPause, pauseEntry;
    if (entry) {
      entry.classList.add('entry-animated');
      const beats=entry.querySelectorAll('.entry-beat');
      const fragments=entry.querySelectorAll('.entry-fragment');
      const record=entry.querySelector('.entry-record');
      const timeline=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'}});
      gsap.set(beats[1],{autoAlpha:0,y:25});
      gsap.set(beats[2],{autoAlpha:0,y:25});
      gsap.set(record,{autoAlpha:.15,scale:.82,rotationY:-16});
      gsap.set(entry.querySelectorAll('.entry-sheet'),{autoAlpha:.2,scale:.85});
      gsap.set(entry.querySelectorAll('.entry-fields,.entry-decision,.entry-imprint'),{autoAlpha:0,y:8});
      timeline.to({}, {duration:.5})
        .to(beats[0],{autoAlpha:0,y:-25,duration:.4},.5)
        .to(beats[1],{autoAlpha:1,y:0,duration:.4},.9)
        .to(fragments[0],{x:wide?50:15,y:35,rotation:0,duration:1},.6)
        .to(fragments[1],{x:wide?-40:-15,y:0,rotation:0,duration:1},.6)
        .to(fragments[2],{x:wide?70:20,y:-30,rotation:0,duration:1},.6)
        .to(record,{autoAlpha:1,scale:1,rotationY:0,rotation:0,duration:1},.7)
        .to(entry.querySelectorAll('.entry-sheet'),{autoAlpha:1,scale:1,duration:.8},.8)
        .to(entry.querySelector('.entry-fields'),{autoAlpha:1,y:0,duration:.6},1.3)
        .to(beats[1],{autoAlpha:0,y:-25,duration:.4},2)
        .to(beats[2],{autoAlpha:1,y:0,duration:.4},2.4)
        .to(fragments,{autoAlpha:0,scale:.75,stagger:.12,duration:.65},2)
        .to(entry.querySelectorAll('.entry-decision,.entry-imprint'),{autoAlpha:1,y:0,stagger:.2,duration:.5},2.5)
        .to(entry.querySelector('.entry-orbit'),{scale:1.15,autoAlpha:.35,duration:1},2.3)
        .to({}, {duration:.6});
      let frozen=false;
      const trigger=ScrollTrigger.create({trigger:entry,start:'top top',end:()=>`+=${innerHeight*(wide?2.5:2)}`,pin:entry.querySelector('.entry-stage'),invalidateOnRefresh:true,onUpdate:self=>{
        if(frozen)return;
        timeline.progress(self.progress);
        entry.querySelector('.entry-track i').style.transform=`scaleX(${self.progress})`;
        entry.querySelector('.entry-counter').textContent=`0${Math.min(3,1+Math.floor(self.progress*3))} — 03`;
      }});
      entryPause=entry.querySelector('[data-entry-pause]');
      entryPause.hidden=false;
      pauseEntry=()=>{frozen=!frozen;entryPause.setAttribute('aria-pressed',String(frozen));entryPause.textContent=frozen?'Resume motion':'Pause motion';if(!frozen)timeline.progress(trigger.progress);};
      entryPause.addEventListener('click',pauseEntry);
    }
    const entrance = document.querySelector('.hero-copy,.page-hero-grid>div:first-child,.intake-copy,.auth-content');
    if (entrance) gsap.from(entrance.children,{y:23,autoAlpha:0,stagger:.09,duration:.85,ease:'power3.out',...(entry?{scrollTrigger:{trigger:entrance,start:'top 90%',once:true}}:{}),clearProps:'transform,opacity,visibility'});
    const sideEntrance = document.querySelector('.page-hero-art,.intake-section .form-shell,.auth-brand-side');
    if (sideEntrance) gsap.from(sideEntrance,{y:22,autoAlpha:0,delay:.15,duration:1,ease:'power3.out',clearProps:'transform,opacity,visibility'});
    const heroArt = document.querySelector('.hero-art');
    if (heroArt) {
      gsap.from(heroArt.querySelector('.hero-object-image'),{y:24,autoAlpha:0,duration:1.2,ease:'power2.out',clearProps:'opacity,visibility'});
      gsap.from(heroArt.querySelectorAll('.floating-reference'),{y:18,autoAlpha:0,duration:.85,stagger:.15,delay:.3,ease:'power3.out',clearProps:'transform,opacity,visibility'});
      gsap.to(heroArt.querySelector('.hero-object-image'),{y:wide?30:14,ease:'none',scrollTrigger:{trigger:heroArt,start:'top top',end:'bottom top',scrub:1}});
    }
    const revealDirections = ['left','right','up','down'];
    const revealOffset = (direction,distance) => ({
      x: direction==='left' ? -distance : direction==='right' ? distance : 0,
      y: direction==='up' ? -distance : direction==='down' ? distance : 0
    });
    const chapterOptions = element => ({trigger:element,start:'top 88%',end:'top 64%',scrub:.55,invalidateOnRefresh:true});
    let chapterIndex = 0;
    document.querySelectorAll('[data-chapter]').forEach(section => {
      const direction = revealDirections[chapterIndex++ % revealDirections.length];
      // Move a section's inner content rather than its outer section. This keeps
      // pinned and sticky layouts (notably the authority story) working normally.
      const revealTarget = section.matches('[data-story]')
        ? section.querySelector('.story-chapters')
        : section.querySelector(':scope > .container') || section;
      if (revealTarget) {
        const distance = direction==='left' || direction==='right' ? (wide?44:26) : (wide?34:22);
        gsap.fromTo(revealTarget,
          {...revealOffset(direction,distance),autoAlpha:.72},
          {x:0,y:0,autoAlpha:1,ease:'none',scrollTrigger:{trigger:revealTarget,start:'top 94%',end:'top 66%',scrub:.65,invalidateOnRefresh:true}}
        );
      }
      if (section.matches('.home-hero,.page-hero,.intake-section')) return;
      const head = section.querySelector('.section-head,.company-statement,.closing-grid>div:first-child,.demo-top');
      if (head) gsap.from(head.children,{y:24,autoAlpha:0,stagger:.07,duration:.75,ease:'power3.out',scrollTrigger:chapterOptions(head),clearProps:'transform,opacity,visibility'});
      const groups = [...section.querySelectorAll('.gap-card,.module-card,.usecase-card,.process-step,.confidence-grid>article,.contact-route,.audience-grid>article,.boundary-grid>div,.related-modules>a')];
      groups.forEach((card,i) => {
        gsap.from(card,{y:wide?32:20,autoAlpha:0,duration:.8,delay:wide?(i%3)*.08:0,ease:'power3.out',scrollTrigger:chapterOptions(card),clearProps:'transform,opacity,visibility'});
        const artwork = card.querySelector('.module-art,.large-icon,.process-step>.ui-icon');
        if (artwork) gsap.from(artwork,{y:12,duration:1,ease:'power2.out',scrollTrigger:chapterOptions(card),clearProps:'transform'});
      });
      const surfaces = section.querySelectorAll('.ledger,.source-matrix,.pilot-card,.expiry-view,.docket,.report-stack,.form-shell,.quote-panel,.workspace,.demo-workspace');
      surfaces.forEach(surface => gsap.from(surface,{y:30,autoAlpha:0,duration:.9,ease:'power3.out',scrollTrigger:chapterOptions(surface),clearProps:'transform,opacity,visibility'}));
      const statsSections = section.matches('.stats-band') ? [section] : [...section.querySelectorAll('.stats-band')];
      statsSections.forEach(stats => {
        gsap.from(stats.querySelectorAll('.stat-card'),{y:wide?70:28,rotation:wide?2:0,autoAlpha:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:chapterOptions(stats),clearProps:'transform,opacity,visibility'});
        gsap.from(stats.querySelectorAll('.stat-card strong'),{textContent:0,duration:1.35,ease:'power2.out',snap:{textContent:1},stagger:.08,scrollTrigger:chapterOptions(stats)});
        gsap.from(stats.querySelector('.stats-art'),{scale:.78,rotation:-18,autoAlpha:0,duration:1.25,ease:'power3.out',scrollTrigger:chapterOptions(stats),clearProps:'transform,opacity,visibility'});
      });
      section.querySelectorAll('.source-matrix').forEach(matrix => gsap.from(matrix.querySelectorAll('.matrix-row:not(.matrix-head)'),{x:12,autoAlpha:0,duration:.6,stagger:.1,scrollTrigger:chapterOptions(matrix),clearProps:'transform,opacity,visibility'}));
      section.querySelectorAll('.graph-frame').forEach(graph => {
        const line = graph.querySelector('.trace-line');
        if (!line) return;
        const length = line.getTotalLength();
        gsap.set(line,{strokeDasharray:length,strokeDashoffset:length});
        gsap.to(line,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:graph,start:'top 78%',end:'bottom 40%',scrub:.8}});
        gsap.from(graph.querySelectorAll('.graph-node'),{autoAlpha:0,y:'+=10',stagger:.08,duration:.7,scrollTrigger:chapterOptions(graph),clearProps:'opacity,visibility'});
      });
      section.querySelectorAll('.report-stack').forEach(stack => gsap.from(stack.querySelector('.report-sheet'),{rotation:-3,y:9,duration:1.1,ease:'power3.out',scrollTrigger:chapterOptions(stack),clearProps:'transform'}));
      section.querySelectorAll('.principle-list').forEach(list => gsap.from(list.children,{y:15,autoAlpha:0,stagger:.09,duration:.65,scrollTrigger:chapterOptions(list),clearProps:'transform,opacity,visibility'}));
    });
    document.querySelectorAll('[data-story]').forEach(story => {
      const chapters = [...story.querySelectorAll('[data-story-step]')];
      const visual = story.querySelector('.story-visual');
      const update = index => {
        chapters.forEach((chapter,i)=>chapter.classList.toggle('is-current',i===index));
        visual.querySelectorAll('.is-highlighted').forEach(field=>field.classList.remove('is-highlighted'));
        visual.querySelectorAll(storyTargets[index]).forEach(field=>field.classList.add('is-highlighted'));
        visual.querySelector('[data-story-caption]').textContent=storyLabels[index];
      };
      update(0);
      if (wide) {
        ScrollTrigger.create({trigger:story.querySelector('.story-grid'),start:'top 120px',end:()=>`+=${Math.max(0,story.querySelector('.story-chapters').offsetHeight-visual.offsetHeight)}`,pin:visual,pinSpacing:false,invalidateOnRefresh:true});
        chapters.forEach((chapter,index)=>ScrollTrigger.create({trigger:chapter,start:'top 45%',end:'bottom 45%',onEnter:()=>update(index),onEnterBack:()=>update(index)}));
        gsap.to(visual.querySelector('[data-story-progress]'),{scaleX:1,ease:'none',scrollTrigger:{trigger:story.querySelector('.story-grid'),start:'top 40%',end:'bottom 60%',scrub:true}});
      } else {
        // Native-flow mobile storytelling: no pin, no scroll hijack, all five steps readable.
        gsap.to(visual.querySelector('[data-story-progress]'),{scaleX:1,ease:'none',scrollTrigger:{trigger:visual,start:'top 80%',end:'bottom 35%',scrub:true}});
      }
    });
    // Art-directed motion: relationships assemble, review panels settle, evidence aligns.
    document.querySelectorAll('.relationship-art').forEach(art => {
      const tl=gsap.timeline({scrollTrigger:{trigger:art,start:'top 90%',end:'bottom 45%',scrub:.65}});
      tl.from(art.querySelector('.tile-one'),{x:-35,y:20,rotation:-22,ease:'none'},0)
        .from(art.querySelector('.tile-two'),{x:35,y:40,rotation:24,ease:'none'},0)
        .from(art.querySelector('.art-thread'),{scaleX:0,transformOrigin:'left',ease:'none'},.15);
    });
    document.querySelectorAll('.module-art').forEach(art => {
      const parts=art.querySelectorAll('.mini-row,.mini-date>span,.mini-graph>span,.mini-report');
      gsap.from(parts,{y:35,rotation:0,scale:.9,stagger:.12,ease:'power2.out',duration:1,scrollTrigger:{trigger:art,start:'top 88%',once:true},clearProps:'transform'});
    });
    document.querySelectorAll('.authority-cinema').forEach(scene => {
      gsap.fromTo(scene.querySelector('.cinema-image'),{yPercent:-3},{yPercent:3,ease:'none',scrollTrigger:{trigger:scene,start:'top bottom',end:'bottom top',scrub:1}});
      gsap.from(scene.querySelectorAll('.cinema-cards>div'),{y:65,autoAlpha:0,stagger:.15,duration:1,ease:'power3.out',scrollTrigger:{trigger:scene.querySelector('.cinema-cards'),start:'top 90%',once:true},clearProps:'transform,opacity,visibility'});
    });
    if(wide) document.querySelectorAll('.proof-section .ledger').forEach(panel=>gsap.from(panel,{rotationX:7,scale:.94,transformPerspective:1400,ease:'none',scrollTrigger:{trigger:panel,start:'top 95%',end:'top 28%',scrub:1}}));
    const signature=document.querySelector('.footer-signature img');
    if(signature) gsap.from(signature,{yPercent:24,autoAlpha:.25,ease:'none',scrollTrigger:{trigger:signature,start:'top 98%',end:'bottom 95%',scrub:.6}});
    const footer=document.querySelector('.footer');
    const followPointer=event=>{
      const rect=footer.getBoundingClientRect();
      footer.style.setProperty('--pointer-x',`${(event.clientX-rect.left)/rect.width*100}%`);
      footer.style.setProperty('--pointer-y',`${(event.clientY-rect.top)/rect.height*100}%`);
    };
    if(wide&&footer)footer.addEventListener('pointermove',followPointer,{passive:true});
    const foot = document.querySelector('.footer-grid');
    if (foot) gsap.from(foot.children,{y:18,autoAlpha:0,stagger:.07,duration:.7,scrollTrigger:chapterOptions(foot),clearProps:'transform,opacity,visibility'});
    return () => {
      entry?.classList.remove('entry-animated');
      if(entryPause){entryPause.removeEventListener('click',pauseEntry);entryPause.hidden=true;entryPause.textContent='Pause motion';entryPause.setAttribute('aria-pressed','false');}
      footer?.removeEventListener('pointermove',followPointer);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();lenis=null;tick=null;
      document.querySelectorAll('.is-highlighted,.is-current').forEach(el=>el.classList.remove('is-highlighted','is-current'));
    };
  });
  document.fonts.ready.then(()=>ScrollTrigger.refresh());
  document.querySelectorAll('img').forEach(img=>{if(!img.complete)img.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});});
  window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
  document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>ScrollTrigger.refresh()));
  window.addEventListener('pageshow',()=>ScrollTrigger.refresh());
  window.addEventListener('pagehide',event=>{if(!event.persisted)media.revert();});
})();
