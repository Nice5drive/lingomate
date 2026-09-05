# LingoMate direkt als APK bauen – auch nur mit dem Smartphone

Du brauchst auf dem Smartphone **kein npm, kein Android Studio und kein Expo Go**. GitHub baut die APK kostenlos in der Cloud.

## Einmalige Einrichtung

1. Öffne **github.com** im Browser und melde dich an bzw. erstelle ein kostenloses Konto.
2. Erstelle über **+ → New repository** ein neues Repository, z. B. `lingomate`.
3. Entpacke die ZIP-Datei `lingomate-github-apk-ready.zip` auf deinem Smartphone.
4. Lade **den Inhalt des Ordners `lingomate-app`** in das neue GitHub-Repository hoch. Wichtig: Auch der versteckte Ordner `.github` muss enthalten sein.
5. Committe die Dateien in den Branch `main`.

## APK erzeugen

1. Öffne im Repository den Reiter **Actions**.
2. Wähle **Build Android APK**.
3. Tippe **Run workflow** → **Run workflow**.
4. Warte, bis der Lauf grün abgeschlossen ist (typisch einige Minuten).
5. Öffne den fertigen Workflow-Lauf und lade unten unter **Artifacts** `LingoMate-Android-APK` herunter.
6. Entpacke das heruntergeladene Artifact. Darin liegt **LingoMate.apk**.
7. Öffne `LingoMate.apk` auf deinem Samsung. Android fragt ggf., ob Installationen aus dieser Quelle erlaubt werden sollen. Erlaube dies für deinen Browser/Dateimanager und installiere die App.

## Was diese APK enthält

- statisches Companion-Bild
- LingoMate-Startseite
- freien Gesprächsmodus im Demo-Betrieb
- französische Sprachausgabe
- bebilderte Vokabelkarten nach Themen
- Vorbereitung für spätere GPT-API-Anbindung

## Hinweis

Die von GitHub erzeugte Datei ist eine **Debug-APK für Testzwecke**. Sie ist installierbar, aber noch keine Play-Store-Veröffentlichung. Für den ersten Echtbetrieb auf deinem eigenen Smartphone ist sie genau dafür gedacht.
