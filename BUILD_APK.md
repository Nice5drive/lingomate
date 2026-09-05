# LingoMate als APK bauen

Die App ist für einen installierbaren Android-Testbuild vorbereitet. Das Profil `preview` in `eas.json` erzeugt ausdrücklich eine **APK** und kein Play-Store-AAB.

## Was bereits vorbereitet ist

- Android-Paketname: `com.lingomate.prototype`
- APK-Buildprofil: `preview`
- App-Icon, Splashscreen und statischer Companion
- lokale Vokabelkarten und Demo-Chat funktionieren ohne Server
- GPT kann später über `EXPO_PUBLIC_LINGOMATE_API_URL` zugeschaltet werden

## APK mit Expo EAS erzeugen

Dafür wird einmalig ein Rechner mit Node.js und Internetzugang benötigt. Im Projektordner:

```bash
npm install
npx eas-cli login
npm run build:apk
```

Beim ersten Build fragt Expo ggf. nach der Android-Signierung. Wähle dabei die automatische Erzeugung/Verwaltung der Keystore-Datei durch EAS.

Nach Abschluss zeigt EAS einen Download-Link zur `.apk`. Diese APK kannst du auf dein Samsung laden und nach Freigabe von „Unbekannte Apps installieren“ direkt installieren.

## Wichtig

Nur mit den heruntergeladenen Projektdateien auf Android lässt sich eine APK nicht lokal erzeugen. Android benötigt dazu entweder Android SDK/Gradle oder einen Cloud-Build-Dienst. Dieses Projekt ist deshalb direkt für EAS Build vorbereitet. 
