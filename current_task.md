# Projekt
life logger (llogg)
path: ~/projects/llogg
~/projects/llogg/public/tests  # tests belong here

# next steps to do

## 1st
In View
Diagrammansicht, Beschriftung der X-Achse
bei Auswahl "Tag" oder "Woche" ist die Beschriftung an der X-Achse zweizeilig anzuzeigen.
    Zeile1: der Wochentag / die Kalenderwoche
    Zeile2: der Monat
    Findet ein Monatswechsel statt, sind beide Monate anzuzeigen.
    Der neue Monat muss exakt am ersten Tag / Kalenderwoche des neuen Monats ausgerichtet sein.
    Der alte Monat muss exakt am letzten Tag / Kalenderwoche des alten Monats ausgerichtet sein 
    Beispiel1 Diagramm über "5 Tage":
    ( Mo Di Mi Do Fr
         Jan)
    Beispiel2 Diagramm  über "5 Tage" mit Monats-Wechsel: 
    ( Do Fr Sa So Mo
       Jan    Feb)
    Beispiel3 Diagramm  über "5 Wochen" mit Monats-Wechsel: 
    ( KW1 KW2 KW3 KW4 KW5
          Jan         Feb)

    Bei der Auswahl Stunden, ist der jeweilige Tag + Monat in einer zweiten Zeile (unter der Uhrzeit) anzuzeigen.
    Beispiel4 Diagramm über 2...N Stunden mit Tageswechsel:
    (22 23  0  1  2  3
    1.Jan   2.Jan)



F-4.19    Zeitbereichs-Navigation mit Pfeil-Buttons (← →) ermöglicht Verschiebung des Datenbereichs um jeweils 1 Zeitspannen-Inkrement vor/zurück.   


In der Auswahl von Time-Span soll die Schrittgröße und Einheit in einer Zeile dargestellt sein.
(+/- und </> fallen weg.
Auswahl erfolgt via roll-up/roll-down von jeweil Schrittgröße und Einheit.
Beispiel5: Time Span:  [3][Days]
Beispiel6: Time Span:  [1][Year]


## last-3
questions you can't answer within 1000 tokens, ask before wasting time.

## Last-2
update ~/projects/llogg/REQUIREMENTS.md to include these changes

## last-1
commit changes to ~/projects/llogg

## last
cp -r ~/projects/llogg/public/* ~/projects/remote-webserver/llogg && chmod -R +r ~/projects/remote-webserver/llogg/*