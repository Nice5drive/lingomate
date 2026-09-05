import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const avatar = require('./assets/avatar.jpg');

const vocabulary = [
  { id:'avion', theme:'Reisen', fr:'un avion', de:'ein Flugzeug', image:require('./assets/vocab/avion.png') },
  { id:'train', theme:'Reisen', fr:'un train', de:'ein Zug', image:require('./assets/vocab/train.png') },
  { id:'valise', theme:'Reisen', fr:'une valise', de:'ein Koffer', image:require('./assets/vocab/valise.png') },
  { id:'croissant', theme:'Essen & Trinken', fr:'un croissant', de:'ein Croissant', image:require('./assets/vocab/croissant.png') },
  { id:'cafe', theme:'Essen & Trinken', fr:'un café', de:'ein Kaffee', image:require('./assets/vocab/cafe.png') },
  { id:'pomme', theme:'Essen & Trinken', fr:'une pomme', de:'ein Apfel', image:require('./assets/vocab/pomme.png') },
  { id:'feu', theme:'Stadt & Verkehr', fr:'un feu', de:'eine Ampel', image:require('./assets/vocab/feu.png') },
  { id:'maison', theme:'Stadt & Verkehr', fr:'une maison', de:'ein Haus', image:require('./assets/vocab/maison.png') },
  { id:'passage', theme:'Stadt & Verkehr', fr:'un passage piéton', de:'ein Zebrastreifen', image:require('./assets/vocab/passage.png') },
  { id:'chemise', theme:'Kleidung', fr:'une chemise', de:'ein Hemd', image:require('./assets/vocab/chemise.png') },
  { id:'chaussures', theme:'Kleidung', fr:'des chaussures', de:'Schuhe', image:require('./assets/vocab/chaussures.png') },
  { id:'veste', theme:'Kleidung', fr:'une veste', de:'eine Jacke', image:require('./assets/vocab/veste.png') },
];

const themeIcons = {
  'Reisen':'airplane',
  'Essen & Trinken':'restaurant',
  'Stadt & Verkehr':'business',
  'Kleidung':'shirt',
};

function TopBar({title, back, onBack}) {
  return <View style={styles.topBar}>
    {back ? <Pressable onPress={onBack} style={styles.iconButton}><Ionicons name="chevron-back" size={26} color="white" /></Pressable> : <View style={{width:42}}/>}
    <Text style={styles.topTitle}>{title}</Text>
    <View style={{width:42}}/>
  </View>
}

function BottomNav({screen,setScreen}) {
  const items=[['home','Home'],['chatbubble-ellipses','Chat'],['book','Lernen'],['person','Profil']];
  return <View style={styles.bottomNav}>
    {items.map(([icon,label])=>{
      const target=label==='Home'?'home':label==='Chat'?'chat':label==='Lernen'?'vocab':'profile';
      const active=screen===target;
      return <Pressable key={label} onPress={()=>setScreen(target)} style={styles.navItem}>
        <Ionicons name={active?icon:`${icon}-outline`} size={25} color={active?'#37a5ff':'#91a7bd'} />
        <Text style={[styles.navLabel,active&&{color:'#37a5ff'}]}>{label}</Text>
      </Pressable>
    })}
  </View>
}

function Home({setScreen}) {
  const tiles=[
    ['chatbubble-ellipses','Freies Gespräch','Natürlich sprechen','chat'],
    ['images','Vokabeln','Lernen mit Bildern','vocab'],
    ['school','Grammatik','Einfach erklärt','grammar'],
    ['people','Rollenspiele','Alltag & Beruf','roleplay'],
    ['compass','Kultur & Leben','Länder entdecken','culture'],
    ['star','Meine Fortschritte','Ziele erreichen','progress'],
  ];
  return <ScrollView contentContainerStyle={{paddingBottom:105}}>
    <View style={styles.brandRow}>
      <View><Text style={styles.brand}>Lingo<Text style={{color:'#3097ff'}}>Mate</Text></Text><Text style={styles.tagline}>Sprachen. Echt. Gemeinsam.</Text></View>
      <Ionicons name="settings-outline" size={27} color="white" />
    </View>
    <View style={styles.hero}>
      <Image source={avatar} style={styles.heroImage}/>
      <View style={styles.bubble}><Text style={styles.bubbleText}>Bonjour !\nPrêt(e) pour une nouvelle conversation ?</Text></View>
    </View>
    <View style={styles.grid}>
      {tiles.map(([icon,title,sub,target])=><Pressable key={title} onPress={()=>setScreen(target)} style={styles.tile}>
        <Ionicons name={icon} size={35} color="#38bdf8" />
        <Text style={styles.tileTitle}>{title}</Text><Text style={styles.tileSub}>{sub}</Text>
      </Pressable>)}
    </View>
  </ScrollView>
}

const demoReplies = [
  "Très bien ! Raconte-moi un peu ta journée.",
  "Bonne phrase. Je te propose une petite correction si tu veux.",
  "D'accord. Et qu'est-ce que tu aimerais faire ce week-end ?",
  "Très intéressant. Peux-tu reformuler cela avec le passé composé ?",
];

function Chat({onBack}) {
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState([{from:'ai',text:'Alors, parlons ! De quoi veux-tu discuter aujourd’hui ?'}]);
  const [busy,setBusy]=useState(false);
  const speak=(text)=>Speech.speak(text,{language:'fr-FR',rate:0.9});
  const send=async()=>{
    const text=input.trim(); if(!text) return;
    setInput(''); setMessages(m=>[...m,{from:'me',text}]); setBusy(true);
    let reply;
    const endpoint=process.env.EXPO_PUBLIC_LINGOMATE_API_URL;
    if(endpoint){
      try {
        const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,language:'fr'})});
        const j=await r.json(); reply=j.reply || j.message;
      } catch(e) {}
    }
    if(!reply) reply=demoReplies[Math.floor(Math.random()*demoReplies.length)];
    setMessages(m=>[...m,{from:'ai',text:reply}]); setBusy(false); speak(reply);
  };
  return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
    <TopBar title="Freies Gespräch" back onBack={onBack}/>
    <View style={styles.langPill}><Text style={styles.langText}>🇫🇷 Französisch</Text></View>
    <ImageBackground source={avatar} style={styles.chatAvatar} imageStyle={{resizeMode:'cover'}}>
      <View style={styles.chatOverlay}/>
      <View style={styles.messageStack}>{messages.slice(-3).map((m,i)=><View key={i} style={[styles.msg,m.from==='me'?styles.msgMe:styles.msgAi]}><Text style={styles.msgText}>{m.text}</Text></View>)}</View>
    </ImageBackground>
    <View style={styles.chatControls}>
      <Pressable style={styles.roundControl} onPress={()=>Alert.alert('Phase 1','Die App ist startbar. Echte Speech-to-Text-Erkennung ergänzen wir als nächsten Schritt; tippe deine Antwort derzeit über die Tastatur ein.')}><Ionicons name="mic" size={30} color="white" /></Pressable>
      <Pressable style={styles.roundControl} onPress={()=>speak(messages.filter(m=>m.from==='ai').slice(-1)[0]?.text || '')}><Ionicons name="volume-high" size={28} color="white" /></Pressable>
      <Pressable style={styles.roundControl} onPress={onBack}><Ionicons name="close" size={30} color="white" /></Pressable>
    </View>
    <View style={styles.modelPill}><Ionicons name="sparkles" color="#b4c9dd" size={17}/><Text style={styles.modelText}>{process.env.EXPO_PUBLIC_LINGOMATE_API_URL?'GPT verbunden':'Demo-GPT-Modus'}</Text></View>
    <View style={styles.composer}><TextInput value={input} onChangeText={setInput} placeholder="Auf Französisch schreiben …" placeholderTextColor="#7990a6" style={styles.input} onSubmitEditing={send}/><Pressable onPress={send} style={styles.send}><Ionicons name={busy?'hourglass':'arrow-up'} size={22} color="white" /></Pressable></View>
  </KeyboardAvoidingView>
}

function Vocab({onBack}) {
  const themes=useMemo(()=>[...new Set(vocabulary.map(v=>v.theme))],[]);
  const [theme,setTheme]=useState(null);
  const [flipped,setFlipped]=useState({});
  if(!theme) return <ScrollView contentContainerStyle={{paddingBottom:40}}><TopBar title="Bildvokabeln" back onBack={onBack}/><Text style={styles.sectionLead}>Wähle ein Thema</Text><View style={styles.themeList}>{themes.map(t=><Pressable key={t} onPress={()=>setTheme(t)} style={styles.themeCard}><Ionicons name={themeIcons[t]} size={37} color="#38bdf8"/><View style={{flex:1}}><Text style={styles.themeTitle}>{t}</Text><Text style={styles.themeSub}>{vocabulary.filter(v=>v.theme===t).length} bebilderte Karten</Text></View><Ionicons name="chevron-forward" size={24} color="#7890a7"/></Pressable>)}</View></ScrollView>;
  const cards=vocabulary.filter(v=>v.theme===theme);
  return <ScrollView contentContainerStyle={{paddingBottom:40}}><TopBar title={theme} back onBack={()=>setTheme(null)}/><Text style={styles.sectionLead}>Tippe eine Karte für die deutsche Übersetzung. 🔊 spricht das französische Wort vor.</Text><View style={styles.vocabGrid}>{cards.map(v=><Pressable key={v.id} style={styles.vocabCard} onPress={()=>setFlipped(f=>({...f,[v.id]:!f[v.id]}))}><Image source={v.image} style={styles.vocabImage}/><View style={styles.vocabBody}><View style={{flex:1}}><Text style={styles.vocabFr}>{flipped[v.id]?v.de:v.fr}</Text><Text style={styles.vocabHint}>{flipped[v.id]?'Deutsch · tippen zum Zurückdrehen':'Französisch · tippen für Deutsch'}</Text></View><Pressable onPress={()=>Speech.speak(v.fr,{language:'fr-FR',rate:.85})} style={styles.speaker}><Ionicons name="volume-high" size={22} color="white"/></Pressable></View></Pressable>)}</View></ScrollView>
}

function Placeholder({title,onBack,icon='construct'}) {
  return <View style={{flex:1}}><TopBar title={title} back onBack={onBack}/><View style={styles.placeholder}><Ionicons name={icon} size={70} color="#38bdf8"/><Text style={styles.placeholderTitle}>{title}</Text><Text style={styles.placeholderText}>Dieser Bereich ist für die nächste Ausbaustufe vorbereitet. Der Prototyp konzentriert sich jetzt auf Gespräch, statischen Companion und bebilderte Vokabelkarten.</Text></View></View>
}

export default function App(){
  const [screen,setScreen]=useState('home');
  const goHome=()=>setScreen('home');
  let body;
  if(screen==='home') body=<Home setScreen={setScreen}/>;
  else if(screen==='chat') body=<Chat onBack={goHome}/>;
  else if(screen==='vocab') body=<Vocab onBack={goHome}/>;
  else if(screen==='grammar') body=<Placeholder title="Grammatik" onBack={goHome} icon="school"/>;
  else if(screen==='roleplay') body=<Placeholder title="Rollenspiele" onBack={goHome} icon="people"/>;
  else if(screen==='culture') body=<Placeholder title="Kultur & Leben" onBack={goHome} icon="compass"/>;
  else if(screen==='progress') body=<Placeholder title="Fortschritte" onBack={goHome} icon="stats-chart"/>;
  else body=<Placeholder title="Profil" onBack={goHome} icon="person"/>;
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content"/><View style={styles.app}>{body}{['home','profile'].includes(screen)&&<BottomNav screen={screen} setScreen={setScreen}/>}</View></SafeAreaView>
}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#06182a'}, app:{flex:1,backgroundColor:'#071b2f'},
  brandRow:{paddingHorizontal:22,paddingTop:16,paddingBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, brand:{fontSize:34,fontWeight:'900',color:'white'}, tagline:{fontSize:15,color:'#a6bad0',marginTop:1},
  hero:{marginHorizontal:16,height:405,borderRadius:24,overflow:'hidden',backgroundColor:'#0c2a46'}, heroImage:{width:'100%',height:'100%',resizeMode:'cover'}, bubble:{position:'absolute',left:18,top:165,maxWidth:'55%',padding:16,borderRadius:20,backgroundColor:'rgba(20,48,76,.92)',borderWidth:1,borderColor:'#7ea3c6'}, bubbleText:{color:'white',fontWeight:'700',fontSize:19,lineHeight:27},
  grid:{padding:14,flexDirection:'row',flexWrap:'wrap',gap:10}, tile:{width:'31.5%',minHeight:142,backgroundColor:'#123451',borderRadius:19,padding:13,justifyContent:'space-between',borderWidth:1,borderColor:'#214967'}, tileTitle:{color:'white',fontSize:14,fontWeight:'800',marginTop:8},tileSub:{color:'#8fa7bc',fontSize:11,lineHeight:16},
  bottomNav:{position:'absolute',bottom:0,left:0,right:0,height:84,backgroundColor:'#06182a',borderTopWidth:1,borderTopColor:'#173954',flexDirection:'row',justifyContent:'space-around',paddingTop:11}, navItem:{alignItems:'center',minWidth:65},navLabel:{color:'#91a7bd',fontSize:12,marginTop:4},
  topBar:{height:64,paddingHorizontal:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},topTitle:{fontSize:21,color:'white',fontWeight:'800'},iconButton:{width:42,height:42,justifyContent:'center',alignItems:'center'},langPill:{alignSelf:'center',paddingHorizontal:18,paddingVertical:6,borderRadius:18,backgroundColor:'#102f4d',marginBottom:8},langText:{color:'#c9d7e4'},
  chatAvatar:{marginHorizontal:14,flex:1,minHeight:350,borderRadius:24,overflow:'hidden',justifyContent:'flex-end'},chatOverlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(4,21,36,.15)'},messageStack:{padding:14,gap:8},msg:{maxWidth:'84%',padding:12,borderRadius:17},msgAi:{alignSelf:'flex-start',backgroundColor:'rgba(22,48,75,.9)',borderWidth:1,borderColor:'#7c98b2'},msgMe:{alignSelf:'flex-end',backgroundColor:'rgba(30,120,205,.92)'},msgText:{color:'white',fontSize:15,lineHeight:21},
  chatControls:{flexDirection:'row',justifyContent:'center',gap:24,paddingTop:12},roundControl:{width:58,height:58,borderRadius:29,backgroundColor:'#0d78d7',alignItems:'center',justifyContent:'center'},modelPill:{alignSelf:'center',marginTop:10,flexDirection:'row',gap:8,alignItems:'center',backgroundColor:'#102f4d',paddingHorizontal:15,paddingVertical:7,borderRadius:18},modelText:{color:'#b4c9dd',fontSize:12},composer:{margin:12,flexDirection:'row',alignItems:'center',borderRadius:26,backgroundColor:'#102f4d',borderWidth:1,borderColor:'#315372',paddingLeft:15,paddingRight:6},input:{flex:1,color:'white',height:50},send:{width:40,height:40,borderRadius:20,backgroundColor:'#168fec',alignItems:'center',justifyContent:'center'},
  sectionLead:{color:'#a9bdd0',paddingHorizontal:18,paddingBottom:13,lineHeight:21},themeList:{padding:14,gap:12},themeCard:{backgroundColor:'#123451',padding:18,borderRadius:20,flexDirection:'row',alignItems:'center',gap:16,borderWidth:1,borderColor:'#214967'},themeTitle:{color:'white',fontWeight:'800',fontSize:18},themeSub:{color:'#8fa7bc',marginTop:3},
  vocabGrid:{padding:14,gap:14},vocabCard:{backgroundColor:'#11314e',borderRadius:22,overflow:'hidden',borderWidth:1,borderColor:'#234b69'},vocabImage:{width:'100%',height:235,resizeMode:'cover'},vocabBody:{padding:16,flexDirection:'row',alignItems:'center',gap:12},vocabFr:{color:'white',fontWeight:'900',fontSize:22},vocabHint:{color:'#91a7bd',marginTop:4,fontSize:12},speaker:{width:44,height:44,borderRadius:22,backgroundColor:'#168fec',alignItems:'center',justifyContent:'center'},
  placeholder:{flex:1,alignItems:'center',justifyContent:'center',padding:34},placeholderTitle:{color:'white',fontSize:27,fontWeight:'900',marginTop:18},placeholderText:{color:'#9db2c5',textAlign:'center',fontSize:16,lineHeight:24,marginTop:12}
});
