/**
 * KUTEMS Seksiyonel Kapı Yay Hesaplama Motoru
 * Kaynak: FF2000.mdb.zip CSV tabloları + KUTEMS_Spring_Calculator_WEB_v1_13.html
 * v1.13 formülleri birebir korunmuştur. Formüller değiştirilmemelidir.
 */

// ─────────────────────────────────────────────
// 1. VERİ: Veren.csv (yay kataloğu)
// ─────────────────────────────────────────────
export interface Spring {
  Veerid: number;
  VeerStatus: number;
  VeerConstante: number; // Nmm/mm
  Draaddikte: number;    // tel çapı mm
  Diameter: number;      // nominal iç çap inch (2=51mm, 2.63=67mm, 3.75=95mm, 6=152mm)
  Gewicht: number;
}

export const SPRINGS: Spring[] = [
  { Veerid: 2,  VeerStatus: 0, VeerConstante: 227777.41,   Draaddikte: 5.00, Diameter: 2.00, Gewicht: 0.005407 },
  { Veerid: 3,  VeerStatus: 1, VeerConstante: 280089.385,  Draaddikte: 5.25, Diameter: 2.00, Gewicht: 0.005703 },
  { Veerid: 4,  VeerStatus: 0, VeerConstante: 332401.359,  Draaddikte: 5.50, Diameter: 2.00, Gewicht: 0.006001 },
  { Veerid: 44, VeerStatus: 0, VeerConstante: 149817.88,   Draaddikte: 4.50, Diameter: 2.00, Gewicht: 0.004822 },
  { Veerid: 6,  VeerStatus: 1, VeerConstante: 396689.725,  Draaddikte: 5.75, Diameter: 2.00, Gewicht: 0.006301 },
  { Veerid: 7,  VeerStatus: 0, VeerConstante: 460978.092,  Draaddikte: 6.00, Diameter: 2.00, Gewicht: 0.006604 },
  { Veerid: 45, VeerStatus: 1, VeerConstante: 188797.645,  Draaddikte: 4.75, Diameter: 2.00, Gewicht: 0.005113 },
  { Veerid: 10, VeerStatus: 0, VeerConstante: 494647.57,   Draaddikte: 6.50, Diameter: 2.63, Gewicht: 0.009217 },
  { Veerid: 11, VeerStatus: 0, VeerConstante: 355789.218,  Draaddikte: 6.50, Diameter: 3.75, Gewicht: 0.012817 },
  { Veerid: 12, VeerStatus: 1, VeerConstante: 577747.91,   Draaddikte: 6.75, Diameter: 2.63, Gewicht: 0.009605 },
  { Veerid: 13, VeerStatus: 1, VeerConstante: 417365.949,  Draaddikte: 6.75, Diameter: 3.75, Gewicht: 0.013342 },
  { Veerid: 14, VeerStatus: 0, VeerConstante: 660848.249,  Draaddikte: 7.00, Diameter: 2.63, Gewicht: 0.009994 },
  { Veerid: 15, VeerStatus: 0, VeerConstante: 478942.679,  Draaddikte: 7.00, Diameter: 3.75, Gewicht: 0.013871 },
  { Veerid: 16, VeerStatus: 1, VeerConstante: 550575.059,  Draaddikte: 7.25, Diameter: 3.75, Gewicht: 0.014401 },
  { Veerid: 18, VeerStatus: 0, VeerConstante: 622207.439,  Draaddikte: 7.50, Diameter: 3.75, Gewicht: 0.014934 },
  { Veerid: 19, VeerStatus: 0, VeerConstante: 399740.316,  Draaddikte: 7.50, Diameter: 6.00, Gewicht: 0.023240 },
  { Veerid: 20, VeerStatus: 1, VeerConstante: 713555.671,  Draaddikte: 7.75, Diameter: 3.75, Gewicht: 0.015469 },
  { Veerid: 21, VeerStatus: 1, VeerConstante: 458944.365,  Draaddikte: 7.75, Diameter: 6.00, Gewicht: 0.024053 },
  { Veerid: 22, VeerStatus: 0, VeerConstante: 804903.903,  Draaddikte: 8.00, Diameter: 3.75, Gewicht: 0.016007 },
  { Veerid: 23, VeerStatus: 0, VeerConstante: 518148.414,  Draaddikte: 8.00, Diameter: 6.00, Gewicht: 0.024867 },
  { Veerid: 24, VeerStatus: 1, VeerConstante: 914725.154,  Draaddikte: 8.25, Diameter: 3.75, Gewicht: 0.016547 },
  { Veerid: 25, VeerStatus: 1, VeerConstante: 589385.347,  Draaddikte: 8.25, Diameter: 6.00, Gewicht: 0.025684 },
  { Veerid: 26, VeerStatus: 0, VeerConstante: 1024546.405, Draaddikte: 8.50, Diameter: 3.75, Gewicht: 0.017090 },
  { Veerid: 27, VeerStatus: 0, VeerConstante: 660622.28,   Draaddikte: 8.50, Diameter: 6.00, Gewicht: 0.026504 },
  { Veerid: 28, VeerStatus: 1, VeerConstante: 1148095.313, Draaddikte: 8.75, Diameter: 3.75, Gewicht: 0.017635 },
  { Veerid: 29, VeerStatus: 1, VeerConstante: 740954.491,  Draaddikte: 8.75, Diameter: 6.00, Gewicht: 0.027326 },
  { Veerid: 30, VeerStatus: 0, VeerConstante: 1271644.221, Draaddikte: 9.00, Diameter: 3.75, Gewicht: 0.018182 },
  { Veerid: 31, VeerStatus: 0, VeerConstante: 821286.703,  Draaddikte: 9.00, Diameter: 6.00, Gewicht: 0.028150 },
  { Veerid: 32, VeerStatus: 1, VeerConstante: 1424117.244, Draaddikte: 9.25, Diameter: 3.75, Gewicht: 0.018732 },
  { Veerid: 33, VeerStatus: 1, VeerConstante: 920656.858,  Draaddikte: 9.25, Diameter: 6.00, Gewicht: 0.028977 },
  { Veerid: 34, VeerStatus: 0, VeerConstante: 1576590.267, Draaddikte: 9.50, Diameter: 3.75, Gewicht: 0.019285 },
  { Veerid: 35, VeerStatus: 0, VeerConstante: 1020027.012, Draaddikte: 9.50, Diameter: 6.00, Gewicht: 0.029806 },
  { Veerid: 36, VeerStatus: 1, VeerConstante: 1136231.906, Draaddikte: 9.75, Diameter: 6.00, Gewicht: 0.030638 },
  { Veerid: 37, VeerStatus: 0, VeerConstante: 1252436.8,   Draaddikte: 10.00, Diameter: 6.00, Gewicht: 0.031472 },
  { Veerid: 38, VeerStatus: 1, VeerConstante: 1379996.669, Draaddikte: 10.25, Diameter: 6.00, Gewicht: 0.032308 },
  { Veerid: 39, VeerStatus: 0, VeerConstante: 1507556.538, Draaddikte: 10.50, Diameter: 6.00, Gewicht: 0.033147 },
  { Veerid: 40, VeerStatus: 1, VeerConstante: 1661724.334, Draaddikte: 10.75, Diameter: 6.00, Gewicht: 0.033988 },
  { Veerid: 41, VeerStatus: 0, VeerConstante: 1815892.129, Draaddikte: 11.00, Diameter: 6.00, Gewicht: 0.034832 },
  { Veerid: 42, VeerStatus: 1, VeerConstante: 1992204.951, Draaddikte: 11.25, Diameter: 6.00, Gewicht: 0.035678 },
  { Veerid: 43, VeerStatus: 0, VeerConstante: 2168517.772, Draaddikte: 11.50, Diameter: 6.00, Gewicht: 0.036527 },
];

// ─────────────────────────────────────────────
// 2. VERİ: VeerDetails.csv (çevrim moment limitleri)
// ─────────────────────────────────────────────
export interface SpringDetail {
  VeerId: number;
  Uitvoering: number;
  Clusternummer: number | null;
  Moment10k: number;
  Moment15k: number;
  Moment25k: number;
  Moment50k: number;
}

export const SPRING_DETAILS: SpringDetail[] = [
  { VeerId: 2,  Uitvoering: 0, Clusternummer: null,  Moment10k: 21787.1,  Moment15k: 20247.8,  Moment25k: 18234.8,  Moment50k: 15629.9 },
  { VeerId: 3,  Uitvoering: 1, Clusternummer: null,  Moment10k: 25161.7,  Moment15k: 23385.6,  Moment25k: 21076.6,  Moment50k: 18057.2 },
  { VeerId: 4,  Uitvoering: 0, Clusternummer: null,  Moment10k: 29834.4,  Moment15k: 27683.3,  Moment25k: 24952.8,  Moment50k: 21412.0 },
  { VeerId: 44, Uitvoering: 0, Clusternummer: 11995, Moment10k: 15748.3,  Moment15k: 14801.0,  Moment25k: 13143.3,  Moment50k: 11367.2 },
  { VeerId: 44, Uitvoering: 1, Clusternummer: 13995, Moment10k: 17008.1,  Moment15k: 15985.1,  Moment25k: 14194.8,  Moment50k: 12276.6 },
  { VeerId: 44, Uitvoering: 2, Clusternummer: 12995, Moment10k: 15575.0,  Moment15k: 14638.2,  Moment25k: 12998.7,  Moment50k: 11242.1 },
  { VeerId: 45, Uitvoering: 0, Clusternummer: null,  Moment10k: 18767.7,  Moment15k: 17524.4,  Moment25k: 15689.1,  Moment50k: 13498.5 },
  { VeerId: 45, Uitvoering: 1, Clusternummer: null,  Moment10k: 20269.1,  Moment15k: 18926.4,  Moment25k: 16944.2,  Moment50k: 14578.4 },
  { VeerId: 45, Uitvoering: 2, Clusternummer: null,  Moment10k: 18561.2,  Moment15k: 17331.6,  Moment25k: 15516.5,  Moment50k: 13350.0 },
  { VeerId: 6,  Uitvoering: 1, Clusternummer: null,  Moment10k: 35717.2,  Moment15k: 33140.9,  Moment25k: 29861.9,  Moment50k: 25646.1 },
  { VeerId: 7,  Uitvoering: 0, Clusternummer: null,  Moment10k: 40641.1,  Moment15k: 37703.6,  Moment25k: 34001.2,  Moment50k: 29192.9 },
  { VeerId: 7,  Uitvoering: 2, Clusternummer: 13005, Moment10k: 35717.2,  Moment15k: 33140.9,  Moment25k: 29861.9,  Moment50k: 25646.1 },
  { VeerId: 2,  Uitvoering: 1, Clusternummer: 13999, Moment10k: 23530.1,  Moment15k: 21867.6,  Moment25k: 19693.6,  Moment50k: 16880.3 },
  { VeerId: 2,  Uitvoering: 2, Clusternummer: 12999, Moment10k: 21547.4,  Moment15k: 20025.1,  Moment25k: 18034.3,  Moment50k: 15457.9 },
  { VeerId: 10, Uitvoering: 0, Clusternummer: null,  Moment10k: 47263.3,  Moment15k: 43825.7,  Moment25k: 39518.3,  Moment50k: 33929.0 },
  { VeerId: 11, Uitvoering: 0, Clusternummer: null,  Moment10k: 44177.4,  Moment15k: 40985.1,  Moment25k: 36960.9,  Moment50k: 31718.7 },
  { VeerId: 13, Uitvoering: 0, Clusternummer: null,  Moment10k: 50560.3,  Moment15k: 46948.8,  Moment25k: 42330.9,  Moment50k: 36351.3 },
  { VeerId: 14, Uitvoering: 0, Clusternummer: null,  Moment10k: 57432.3,  Moment15k: 53271.5,  Moment25k: 48033.8,  Moment50k: 41243.3 },
  { VeerId: 15, Uitvoering: 0, Clusternummer: null,  Moment10k: 56983.4,  Moment15k: 52857.3,  Moment25k: 47667.4,  Moment50k: 40922.5 },
  { VeerId: 16, Uitvoering: 1, Clusternummer: null,  Moment10k: 66561.9,  Moment15k: 61702.5,  Moment25k: 55692.1,  Moment50k: 47763.5 },
  { VeerId: 16, Uitvoering: 2, Clusternummer: null,  Moment10k: 60953.5,  Moment15k: 56503.5,  Moment25k: 50999.5,  Moment50k: 43738.9 },
  { VeerId: 18, Uitvoering: 0, Clusternummer: 12030, Moment10k: 67374.2,  Moment15k: 62401.1,  Moment25k: 56362.3,  Moment50k: 48310.5 },
  { VeerId: 18, Uitvoering: 1, Clusternummer: null,  Moment10k: 72764.1,  Moment15k: 67393.2,  Moment25k: 60871.2,  Moment50k: 52175.3 },
  { VeerId: 19, Uitvoering: 1, Clusternummer: 14033, Moment10k: 72764.1,  Moment15k: 67393.2,  Moment25k: 60871.2,  Moment50k: 52175.3 },
  { VeerId: 20, Uitvoering: 0, Clusternummer: null,  Moment10k: 79983.1,  Moment15k: 74127.9,  Moment25k: 66867.3,  Moment50k: 57381.7 },
  { VeerId: 20, Uitvoering: 2, Clusternummer: null,  Moment10k: 73308.1,  Moment15k: 67921.3,  Moment25k: 61304.8,  Moment50k: 52580.4 },
  { VeerId: 21, Uitvoering: 0, Clusternummer: null,  Moment10k: 79983.1,  Moment15k: 74127.9,  Moment25k: 66867.3,  Moment50k: 57381.7 },
  { VeerId: 22, Uitvoering: 0, Clusternummer: null,  Moment10k: 87342.5,  Moment15k: 80948.5,  Moment25k: 73019.9,  Moment50k: 62661.6 },
  { VeerId: 22, Uitvoering: 1, Clusternummer: 14035, Moment10k: 87342.5,  Moment15k: 80948.5,  Moment25k: 73019.9,  Moment50k: 62661.6 },
  { VeerId: 22, Uitvoering: 2, Clusternummer: 13035, Moment10k: 79983.1,  Moment15k: 74127.9,  Moment25k: 66867.3,  Moment50k: 57381.7 },
  { VeerId: 23, Uitvoering: 0, Clusternummer: 12040, Moment10k: 80872.7,  Moment15k: 74952.3,  Moment25k: 67611.0,  Moment50k: 58020.0 },
  { VeerId: 23, Uitvoering: 1, Clusternummer: 14040, Moment10k: 87342.5,  Moment15k: 80948.5,  Moment25k: 73019.9,  Moment50k: 62661.6 },
  { VeerId: 23, Uitvoering: 2, Clusternummer: 13040, Moment10k: 79983.1,  Moment15k: 74127.9,  Moment25k: 66867.3,  Moment50k: 57381.7 },
  { VeerId: 24, Uitvoering: 0, Clusternummer: null,  Moment10k: 88450.8,  Moment15k: 81997.6,  Moment25k: 73945.9,  Moment50k: 63466.7 },
  { VeerId: 24, Uitvoering: 1, Clusternummer: null,  Moment10k: 95526.9,  Moment15k: 88557.4,  Moment25k: 79861.5,  Moment50k: 68544.1 },
  { VeerId: 24, Uitvoering: 2, Clusternummer: null,  Moment10k: 87477.9,  Moment15k: 81095.6,  Moment25k: 73132.5,  Moment50k: 62768.6 },
  { VeerId: 25, Uitvoering: 0, Clusternummer: null,  Moment10k: 88450.8,  Moment15k: 81997.6,  Moment25k: 73945.9,  Moment50k: 63466.7 },
  { VeerId: 25, Uitvoering: 1, Clusternummer: null,  Moment10k: 95526.9,  Moment15k: 88557.4,  Moment25k: 79861.5,  Moment50k: 68544.1 },
  { VeerId: 25, Uitvoering: 2, Clusternummer: null,  Moment10k: 87477.9,  Moment15k: 81095.6,  Moment25k: 73132.5,  Moment50k: 62768.6 },
  { VeerId: 26, Uitvoering: 0, Clusternummer: 12045, Moment10k: 96029.0,  Moment15k: 89042.9,  Moment25k: 80280.7,  Moment50k: 68913.5 },
  { VeerId: 26, Uitvoering: 1, Clusternummer: 14045, Moment10k: 103711.3, Moment15k: 96166.3,  Moment25k: 86703.1,  Moment50k: 74426.6 },
  { VeerId: 26, Uitvoering: 2, Clusternummer: 13045, Moment10k: 94972.6,  Moment15k: 88063.4,  Moment25k: 79397.6,  Moment50k: 68155.5 },
  { VeerId: 27, Uitvoering: 0, Clusternummer: 12050, Moment10k: 96029.0,  Moment15k: 89042.9,  Moment25k: 80280.7,  Moment50k: 68913.5 },
  { VeerId: 27, Uitvoering: 1, Clusternummer: 14050, Moment10k: 103711.3, Moment15k: 96166.3,  Moment25k: 86703.1,  Moment50k: 74426.6 },
  { VeerId: 27, Uitvoering: 2, Clusternummer: 13050, Moment10k: 94972.6,  Moment15k: 88063.4,  Moment25k: 79397.6,  Moment50k: 68155.5 },
  { VeerId: 28, Uitvoering: 0, Clusternummer: null,  Moment10k: 104021.5, Moment15k: 96443.4,  Moment25k: 86970.7,  Moment50k: 74656.3 },
  { VeerId: 28, Uitvoering: 1, Clusternummer: null,  Moment10k: 112343.2, Moment15k: 104158.9, Moment25k: 93928.4,  Moment50k: 80628.8 },
  { VeerId: 28, Uitvoering: 2, Clusternummer: null,  Moment10k: 102877.3, Moment15k: 95382.5,  Moment25k: 86014.1,  Moment50k: 73835.1 },
  { VeerId: 29, Uitvoering: 0, Clusternummer: null,  Moment10k: 104021.5, Moment15k: 96443.4,  Moment25k: 86970.7,  Moment50k: 74656.3 },
  { VeerId: 29, Uitvoering: 1, Clusternummer: null,  Moment10k: 112343.2, Moment15k: 104158.9, Moment25k: 93928.4,  Moment50k: 80628.8 },
  { VeerId: 29, Uitvoering: 2, Clusternummer: null,  Moment10k: 102877.3, Moment15k: 95382.5,  Moment25k: 86014.1,  Moment50k: 73835.1 },
  { VeerId: 30, Uitvoering: 0, Clusternummer: 12055, Moment10k: 112014.1, Moment15k: 103843.9, Moment25k: 93660.8,  Moment50k: 80399.1 },
  { VeerId: 30, Uitvoering: 1, Clusternummer: 14055, Moment10k: 120975.2, Moment15k: 112151.4, Moment25k: 101153.7, Moment50k: 86831.0 },
  { VeerId: 30, Uitvoering: 2, Clusternummer: 13055, Moment10k: 110781.9, Moment15k: 102701.6, Moment25k: 92630.5,  Moment50k: 79514.7 },
  { VeerId: 31, Uitvoering: 0, Clusternummer: 12060, Moment10k: 112014.1, Moment15k: 103843.9, Moment25k: 93660.8,  Moment50k: 80399.1 },
  { VeerId: 31, Uitvoering: 1, Clusternummer: 14060, Moment10k: 120975.2, Moment15k: 112151.4, Moment25k: 101153.7, Moment50k: 86831.0 },
  { VeerId: 31, Uitvoering: 2, Clusternummer: 13060, Moment10k: 110781.9, Moment15k: 102701.6, Moment25k: 92630.5,  Moment50k: 79514.7 },
  { VeerId: 32, Uitvoering: 0, Clusternummer: null,  Moment10k: 121309.1, Moment15k: 112428.5, Moment25k: 101416.5, Moment50k: 87089.2 },
  { VeerId: 32, Uitvoering: 1, Clusternummer: null,  Moment10k: 131013.8, Moment15k: 121422.8, Moment25k: 109529.9, Moment50k: 94056.3 },
  { VeerId: 32, Uitvoering: 2, Clusternummer: null,  Moment10k: 119974.7, Moment15k: 111191.8, Moment25k: 100301.0, Moment50k: 86131.2 },
  { VeerId: 33, Uitvoering: 0, Clusternummer: null,  Moment10k: 121309.1, Moment15k: 112428.5, Moment25k: 101416.5, Moment50k: 87089.2 },
  { VeerId: 33, Uitvoering: 1, Clusternummer: null,  Moment10k: 131013.8, Moment15k: 121422.8, Moment25k: 109529.9, Moment50k: 94056.3 },
  { VeerId: 33, Uitvoering: 2, Clusternummer: null,  Moment10k: 119974.7, Moment15k: 111191.8, Moment25k: 100301.0, Moment50k: 86131.2 },
  { VeerId: 34, Uitvoering: 0, Clusternummer: 12065, Moment10k: 130604.1, Moment15k: 121013.1, Moment25k: 109172.3, Moment50k: 93779.2 },
  { VeerId: 34, Uitvoering: 1, Clusternummer: 14065, Moment10k: 141052.5, Moment15k: 130694.1, Moment25k: 117906.0, Moment50k: 101281.6 },
  { VeerId: 34, Uitvoering: 2, Clusternummer: 13065, Moment10k: 129167.5, Moment15k: 119681.9, Moment25k: 107971.4, Moment50k: 92747.6 },
  { VeerId: 35, Uitvoering: 0, Clusternummer: 12070, Moment10k: 130604.1, Moment15k: 121013.1, Moment25k: 109172.3, Moment50k: 93779.2 },
  { VeerId: 35, Uitvoering: 1, Clusternummer: 14070, Moment10k: 141052.5, Moment15k: 130694.1, Moment25k: 117906.0, Moment50k: 101281.6 },
  { VeerId: 35, Uitvoering: 2, Clusternummer: 13070, Moment10k: 129167.5, Moment15k: 119681.9, Moment25k: 107971.4, Moment50k: 92747.6 },
  { VeerId: 36, Uitvoering: 0, Clusternummer: null,  Moment10k: 140787.2, Moment15k: 130485.7, Moment25k: 117697.6, Moment50k: 101120.5 },
  { VeerId: 36, Uitvoering: 1, Clusternummer: null,  Moment10k: 152050.2, Moment15k: 140924.6, Moment25k: 127113.5, Moment50k: 109210.2 },
  { VeerId: 36, Uitvoering: 2, Clusternummer: null,  Moment10k: 139238.6, Moment15k: 129050.4, Moment25k: 116403.0, Moment50k: 100008.2 },
  { VeerId: 37, Uitvoering: 0, Clusternummer: 12075, Moment10k: 150970.3, Moment15k: 139958.4, Moment25k: 126223.0, Moment50k: 108461.8 },
  { VeerId: 37, Uitvoering: 1, Clusternummer: 14075, Moment10k: 163048.0, Moment15k: 151155.0, Moment25k: 136320.9, Moment50k: 117138.8 },
  { VeerId: 37, Uitvoering: 2, Clusternummer: 13075, Moment10k: 149309.7, Moment15k: 138418.8, Moment25k: 124834.6, Moment50k: 107268.7 },
  { VeerId: 38, Uitvoering: 0, Clusternummer: null,  Moment10k: 161567.8, Moment15k: 149786.2, Moment25k: 135103.6, Moment50k: 116039.9 },
  { VeerId: 38, Uitvoering: 1, Clusternummer: null,  Moment10k: 174493.3, Moment15k: 161769.1, Moment25k: 145911.9, Moment50k: 125323.1 },
  { VeerId: 38, Uitvoering: 2, Clusternummer: null,  Moment10k: 159790.6, Moment15k: 148138.6, Moment25k: 133617.5, Moment50k: 114763.5 },
  { VeerId: 39, Uitvoering: 0, Clusternummer: 12080, Moment10k: 172165.4, Moment15k: 159614.1, Moment25k: 143984.2, Moment50k: 123618.1 },
  { VeerId: 39, Uitvoering: 1, Clusternummer: 14080, Moment10k: 185938.6, Moment15k: 172383.2, Moment25k: 155503.0, Moment50k: 133507.5 },
  { VeerId: 39, Uitvoering: 2, Clusternummer: 13080, Moment10k: 170271.6, Moment15k: 157858.4, Moment25k: 142400.4, Moment50k: 122258.3 },
  { VeerId: 40, Uitvoering: 0, Clusternummer: null,  Moment10k: 184302.2, Moment15k: 170922.1, Moment25k: 154167.3, Moment50k: 132380.3 },
  { VeerId: 40, Uitvoering: 1, Clusternummer: null,  Moment10k: 199046.4, Moment15k: 184595.9, Moment25k: 166500.7, Moment50k: 142970.7 },
  { VeerId: 40, Uitvoering: 2, Clusternummer: null,  Moment10k: 182274.9, Moment15k: 169041.9, Moment25k: 152471.5, Moment50k: 130924.1 },
  { VeerId: 41, Uitvoering: 0, Clusternummer: 12085, Moment10k: 196439.0, Moment15k: 182230.1, Moment25k: 164350.4, Moment50k: 141142.5 },
  { VeerId: 41, Uitvoering: 1, Clusternummer: 14085, Moment10k: 212154.2, Moment15k: 196808.5, Moment25k: 177498.5, Moment50k: 152433.8 },
  { VeerId: 41, Uitvoering: 2, Clusternummer: 13085, Moment10k: 194278.2, Moment15k: 180225.5, Moment25k: 162542.6, Moment50k: 139589.9 },
  { VeerId: 42, Uitvoering: 0, Clusternummer: null,  Moment10k: 209641.5, Moment15k: 194426.1, Moment25k: 175362.4, Moment50k: 150615.1 },
  { VeerId: 42, Uitvoering: 1, Clusternummer: null,  Moment10k: 226412.9, Moment15k: 209980.2, Moment25k: 189391.4, Moment50k: 162664.3 },
  { VeerId: 42, Uitvoering: 2, Clusternummer: null,  Moment10k: 207335.5, Moment15k: 192287.4, Moment25k: 173433.4, Moment50k: 148958.3 },
  { VeerId: 43, Uitvoering: 0, Clusternummer: 12090, Moment10k: 222844.0, Moment15k: 206622.1, Moment25k: 186374.3, Moment50k: 160087.7 },
  { VeerId: 43, Uitvoering: 1, Clusternummer: 14090, Moment10k: 240671.6, Moment15k: 223151.9, Moment25k: 201284.3, Moment50k: 172894.8 },
  { VeerId: 43, Uitvoering: 2, Clusternummer: 13090, Moment10k: 220392.8, Moment15k: 204349.3, Moment25k: 184324.2, Moment50k: 158326.8 },
];

// ─────────────────────────────────────────────
// 3. VERİ: Kabeltrommels.csv (tambur kataloğu)
// ─────────────────────────────────────────────
export interface Drum {
  Kabeltrommeltype: string;
  Asdiameter: number;
  KabeltrommelSoort: number; // 0=NL, 1=HL, 2=VL
  Volgorde: number;
  MaxGewicht: number;
  MaxHilift: number;
  MaxKabeldikte: number;
  MaxHoogte: number;
  LiftArmHiMoment: number;
  LiftArmFlatMoment: number;
  OmtrekVlak: number;
  KabelCorrectie: number;
  TreksetCorrectie: number;
  Diameter: number;
  LagerPlaatHartMaat: number;
  Clusternummer: number;
  InbouwhoogteDrum: number;
  DetailTabelNummer: number;
}

export const DRUMS: Drum[] = [
  { Kabeltrommeltype: "FF-54LC",        Asdiameter: 0, KabeltrommelSoort: 1, Volgorde: 1, MaxGewicht: 240,  MaxHilift: 1260, MaxKabeldikte: 3, MaxHoogte: 3050,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 52.4,    OmtrekVlak: 328.93,  KabelCorrectie: 1600, TreksetCorrectie: 0,   Diameter: 147, LagerPlaatHartMaat: 86,  Clusternummer: 1125, InbouwhoogteDrum: 0,   DetailTabelNummer: 4 },
  { Kabeltrommeltype: "FF-4X8",         Asdiameter: 0, KabeltrommelSoort: 0, Volgorde: 1, MaxGewicht: 240,  MaxHilift: 0,    MaxKabeldikte: 3, MaxHoogte: 2440,  LiftArmHiMoment: 58.191,  LiftArmFlatMoment: 52.781,  OmtrekVlak: 331.622, KabelCorrectie: 571,  TreksetCorrectie: 780, Diameter: 126, LagerPlaatHartMaat: 86,  Clusternummer: 1100, InbouwhoogteDrum: 0,   DetailTabelNummer: 0 },
  { Kabeltrommeltype: "FF-VL-28-5/4",   Asdiameter: 1, KabeltrommelSoort: 2, Volgorde: 3, MaxGewicht: 825,  MaxHilift: 0,    MaxKabeldikte: 6, MaxHoogte: 7000,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 0,       OmtrekVlak: 0,       KabelCorrectie: 8950, TreksetCorrectie: 0,   Diameter: 360, LagerPlaatHartMaat: 190, Clusternummer: 1165, InbouwhoogteDrum: 356, DetailTabelNummer: 9 },
  { Kabeltrommeltype: "FF-NL-32",       Asdiameter: 0, KabeltrommelSoort: 0, Volgorde: 4, MaxGewicht: 700,  MaxHilift: 0,    MaxKabeldikte: 6, MaxHoogte: 10000, LiftArmHiMoment: 109.537, LiftArmFlatMoment: 104.775, OmtrekVlak: 658.368, KabelCorrectie: 1905, TreksetCorrectie: 780, Diameter: 229, LagerPlaatHartMaat: 127, Clusternummer: 1115, InbouwhoogteDrum: 237, DetailTabelNummer: 0 },
  { Kabeltrommeltype: "FF-NL-32-5/4",   Asdiameter: 1, KabeltrommelSoort: 0, Volgorde: 4, MaxGewicht: 700,  MaxHilift: 0,    MaxKabeldikte: 6, MaxHoogte: 10000, LiftArmHiMoment: 109.537, LiftArmFlatMoment: 104.775, OmtrekVlak: 658.368, KabelCorrectie: 1905, TreksetCorrectie: 780, Diameter: 229, LagerPlaatHartMaat: 152, Clusternummer: 1120, InbouwhoogteDrum: 237, DetailTabelNummer: 0 },
  { Kabeltrommeltype: "FF-NL-10",       Asdiameter: 0, KabeltrommelSoort: 0, Volgorde: 1, MaxGewicht: 1,    MaxHilift: 0,    MaxKabeldikte: 3, MaxHoogte: 2628,  LiftArmHiMoment: 39.5,    LiftArmFlatMoment: 39.5,    OmtrekVlak: 248.0,   KabelCorrectie: 650,  TreksetCorrectie: 250, Diameter: 86,  LagerPlaatHartMaat: 86,  Clusternummer: 1104, InbouwhoogteDrum: 0,   DetailTabelNummer: 0 },
  { Kabeltrommeltype: "FF05NL18",       Asdiameter: 0, KabeltrommelSoort: 0, Volgorde: 3, MaxGewicht: 500,  MaxHilift: 0,    MaxKabeldikte: 4, MaxHoogte: 5510,  LiftArmHiMoment: 74.6,    LiftArmFlatMoment: 69.063,  OmtrekVlak: 433.832, KabelCorrectie: 673,  TreksetCorrectie: 330, Diameter: 152, LagerPlaatHartMaat: 86,  Clusternummer: 1113, InbouwhoogteDrum: 166, DetailTabelNummer: 0 },
  { Kabeltrommeltype: "FF-VL-28",       Asdiameter: 0, KabeltrommelSoort: 2, Volgorde: 3, MaxGewicht: 825,  MaxHilift: 0,    MaxKabeldikte: 6, MaxHoogte: 7000,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 0,       OmtrekVlak: 0,       KabelCorrectie: 8950, TreksetCorrectie: 0,   Diameter: 360, LagerPlaatHartMaat: 190, Clusternummer: 1160, InbouwhoogteDrum: 356, DetailTabelNummer: 9 },
  { Kabeltrommeltype: "FF-HL-164",      Asdiameter: 0, KabeltrommelSoort: 1, Volgorde: 4, MaxGewicht: 650,  MaxHilift: 4100, MaxKabeldikte: 6, MaxHoogte: 6000,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 84.15,   OmtrekVlak: 528.65,  KabelCorrectie: 6205, TreksetCorrectie: 0,   Diameter: 279, LagerPlaatHartMaat: 152, Clusternummer: 1140, InbouwhoogteDrum: 295, DetailTabelNummer: 3 },
  { Kabeltrommeltype: "FF-HL-164-5/4",  Asdiameter: 1, KabeltrommelSoort: 1, Volgorde: 4, MaxGewicht: 650,  MaxHilift: 4100, MaxKabeldikte: 6, MaxHoogte: 6000,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 84.15,   OmtrekVlak: 528.65,  KabelCorrectie: 6205, TreksetCorrectie: 0,   Diameter: 279, LagerPlaatHartMaat: 152, Clusternummer: 1145, InbouwhoogteDrum: 295, DetailTabelNummer: 3 },
  { Kabeltrommeltype: "FF05NL32",       Asdiameter: 0, KabeltrommelSoort: 0, Volgorde: 4, MaxGewicht: 900,  MaxHilift: 0,    MaxKabeldikte: 6, MaxHoogte: 9750,  LiftArmHiMoment: 109.537, LiftArmFlatMoment: 104.775, OmtrekVlak: 658.368, KabelCorrectie: 874,  TreksetCorrectie: 780, Diameter: 229, LagerPlaatHartMaat: 127, Clusternummer: 1117, InbouwhoogteDrum: 237, DetailTabelNummer: 0 },
  { Kabeltrommeltype: "FF05NL32-125",   Asdiameter: 1, KabeltrommelSoort: 0, Volgorde: 4, MaxGewicht: 900,  MaxHilift: 0,    MaxKabeldikte: 6, MaxHoogte: 9750,  LiftArmHiMoment: 109.537, LiftArmFlatMoment: 104.775, OmtrekVlak: 658.368, KabelCorrectie: 874,  TreksetCorrectie: 780, Diameter: 229, LagerPlaatHartMaat: 152, Clusternummer: 1122, InbouwhoogteDrum: 237, DetailTabelNummer: 0 },
  { Kabeltrommeltype: "FF05VL11",       Asdiameter: 0, KabeltrommelSoort: 2, Volgorde: 1, MaxGewicht: 385,  MaxHilift: 0,    MaxKabeldikte: 4, MaxHoogte: 3290,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 0,       OmtrekVlak: 0,       KabelCorrectie: 3908, TreksetCorrectie: 0,   Diameter: 218, LagerPlaatHartMaat: 127, Clusternummer: 1153, InbouwhoogteDrum: 229, DetailTabelNummer: 9 },
  { Kabeltrommeltype: "FF05VL18",       Asdiameter: 0, KabeltrommelSoort: 2, Volgorde: 2, MaxGewicht: 500,  MaxHilift: 0,    MaxKabeldikte: 4, MaxHoogte: 5585,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 0,       OmtrekVlak: 0,       KabelCorrectie: 6263, TreksetCorrectie: 0,   Diameter: 284, LagerPlaatHartMaat: 152, Clusternummer: 1158, InbouwhoogteDrum: 295, DetailTabelNummer: 9 },
  { Kabeltrommeltype: "FF-NL-18",       Asdiameter: 0, KabeltrommelSoort: 0, Volgorde: 3, MaxGewicht: 500,  MaxHilift: 0,    MaxKabeldikte: 5, MaxHoogte: 5570,  LiftArmHiMoment: 74.6,    LiftArmFlatMoment: 69.063,  OmtrekVlak: 433.832, KabelCorrectie: 1380, TreksetCorrectie: 330, Diameter: 152, LagerPlaatHartMaat: 86,  Clusternummer: 1111, InbouwhoogteDrum: 166, DetailTabelNummer: 0 },
  { Kabeltrommeltype: "FF-NL-12",       Asdiameter: 0, KabeltrommelSoort: 0, Volgorde: 2, MaxGewicht: 500,  MaxHilift: 0,    MaxKabeldikte: 5, MaxHoogte: 3680,  LiftArmHiMoment: 58.191,  LiftArmFlatMoment: 52.781,  OmtrekVlak: 331.622, KabelCorrectie: 1165, TreksetCorrectie: 250, Diameter: 124, LagerPlaatHartMaat: 86,  Clusternummer: 1106, InbouwhoogteDrum: 132, DetailTabelNummer: 0 },
  { Kabeltrommeltype: "FF-HL-120",      Asdiameter: 0, KabeltrommelSoort: 1, Volgorde: 3, MaxGewicht: 500,  MaxHilift: 3050, MaxKabeldikte: 5, MaxHoogte: 4800,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 75.387,  OmtrekVlak: 473.71,  KabelCorrectie: 4830, TreksetCorrectie: 0,   Diameter: 238, LagerPlaatHartMaat: 127, Clusternummer: 1136, InbouwhoogteDrum: 249, DetailTabelNummer: 2 },
  { Kabeltrommeltype: "FF-HL-54",       Asdiameter: 0, KabeltrommelSoort: 1, Volgorde: 2, MaxGewicht: 500,  MaxHilift: 1370, MaxKabeldikte: 5, MaxHoogte: 4800,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 69.037,  OmtrekVlak: 433.832, KabelCorrectie: 2690, TreksetCorrectie: 0,   Diameter: 188, LagerPlaatHartMaat: 111, Clusternummer: 1131, InbouwhoogteDrum: 199, DetailTabelNummer: 1 },
  { Kabeltrommeltype: "FF-VL-11",       Asdiameter: 0, KabeltrommelSoort: 2, Volgorde: 1, MaxGewicht: 500,  MaxHilift: 0,    MaxKabeldikte: 5, MaxHoogte: 3300,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 0,       OmtrekVlak: 0,       KabelCorrectie: 4895, TreksetCorrectie: 0,   Diameter: 218, LagerPlaatHartMaat: 127, Clusternummer: 1151, InbouwhoogteDrum: 229, DetailTabelNummer: 9 },
  { Kabeltrommeltype: "FF-VL-18",       Asdiameter: 0, KabeltrommelSoort: 2, Volgorde: 2, MaxGewicht: 500,  MaxHilift: 0,    MaxKabeldikte: 5, MaxHoogte: 6000,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 0,       OmtrekVlak: 0,       KabelCorrectie: 8105, TreksetCorrectie: 0,   Diameter: 284, LagerPlaatHartMaat: 152, Clusternummer: 1156, InbouwhoogteDrum: 295, DetailTabelNummer: 9 },
  { Kabeltrommeltype: "FF-VL-18-5/4",  Asdiameter: 1, KabeltrommelSoort: 2, Volgorde: 2, MaxGewicht: 500,  MaxHilift: 0,    MaxKabeldikte: 5, MaxHoogte: 6000,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 0,       OmtrekVlak: 0,       KabelCorrectie: 8105, TreksetCorrectie: 0,   Diameter: 284, LagerPlaatHartMaat: 152, Clusternummer: 1157, InbouwhoogteDrum: 295, DetailTabelNummer: 9 },
  { Kabeltrommeltype: "FF05VL18-125",   Asdiameter: 1, KabeltrommelSoort: 2, Volgorde: 2, MaxGewicht: 500,  MaxHilift: 0,    MaxKabeldikte: 4, MaxHoogte: 5585,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 0,       OmtrekVlak: 0,       KabelCorrectie: 6263, TreksetCorrectie: 0,   Diameter: 284, LagerPlaatHartMaat: 152, Clusternummer: 1159, InbouwhoogteDrum: 295, DetailTabelNummer: 9 },
  { Kabeltrommeltype: "FF05NL12",       Asdiameter: 0, KabeltrommelSoort: 0, Volgorde: 2, MaxGewicht: 340,  MaxHilift: 0,    MaxKabeldikte: 4, MaxHoogte: 3730,  LiftArmHiMoment: 58.191,  LiftArmFlatMoment: 52.781,  OmtrekVlak: 331.622, KabelCorrectie: 605,  TreksetCorrectie: 250, Diameter: 124, LagerPlaatHartMaat: 86,  Clusternummer: 1108, InbouwhoogteDrum: 132, DetailTabelNummer: 0 },
  { Kabeltrommeltype: "FF05HL164-125",  Asdiameter: 1, KabeltrommelSoort: 1, Volgorde: 4, MaxGewicht: 900,  MaxHilift: 4110, MaxKabeldikte: 6, MaxHoogte: 6000,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 84.15,   OmtrekVlak: 528.65,  KabelCorrectie: 4952, TreksetCorrectie: 0,   Diameter: 279, LagerPlaatHartMaat: 152, Clusternummer: 1147, InbouwhoogteDrum: 295, DetailTabelNummer: 3 },
  { Kabeltrommeltype: "FF05HL54",       Asdiameter: 0, KabeltrommelSoort: 1, Volgorde: 2, MaxGewicht: 455,  MaxHilift: 1370, MaxKabeldikte: 4, MaxHoogte: 4720,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 69.037,  OmtrekVlak: 433.832, KabelCorrectie: 1835, TreksetCorrectie: 0,   Diameter: 188, LagerPlaatHartMaat: 111, Clusternummer: 1133, InbouwhoogteDrum: 199, DetailTabelNummer: 1 },
  { Kabeltrommeltype: "FF05HL120",      Asdiameter: 0, KabeltrommelSoort: 1, Volgorde: 3, MaxGewicht: 455,  MaxHilift: 3010, MaxKabeldikte: 4, MaxHoogte: 4720,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 75.387,  OmtrekVlak: 473.71,  KabelCorrectie: 3688, TreksetCorrectie: 0,   Diameter: 238, LagerPlaatHartMaat: 127, Clusternummer: 1138, InbouwhoogteDrum: 249, DetailTabelNummer: 2 },
  { Kabeltrommeltype: "FF05HL164",      Asdiameter: 0, KabeltrommelSoort: 1, Volgorde: 4, MaxGewicht: 900,  MaxHilift: 4110, MaxKabeldikte: 6, MaxHoogte: 6000,  LiftArmHiMoment: 0,       LiftArmFlatMoment: 84.15,   OmtrekVlak: 528.65,  KabelCorrectie: 4952, TreksetCorrectie: 0,   Diameter: 279, LagerPlaatHartMaat: 152, Clusternummer: 1142, InbouwhoogteDrum: 295, DetailTabelNummer: 3 },
];

// ─────────────────────────────────────────────
// 4. VERİ: Kabeltrommeldetails.csv (Lift-Multiplier-Revolutions eğrileri)
// ─────────────────────────────────────────────
export interface DrumDetail {
  DetailTabelNummer: number;
  Lift: number;
  Multiplier: number;
  Revolutions: number;
}

export const DRUM_DETAILS: DrumDetail[] = [
  // Table 1 (FF-HL-54)
  { DetailTabelNummer: 1, Lift: 76,   Multiplier: 72.0987,  Revolutions: 0.1699 },
  { DetailTabelNummer: 1, Lift: 152,  Multiplier: 72.4521,  Revolutions: 0.3379 },
  { DetailTabelNummer: 1, Lift: 228,  Multiplier: 72.8027,  Revolutions: 0.5039 },
  { DetailTabelNummer: 1, Lift: 304,  Multiplier: 73.1506,  Revolutions: 0.6681 },
  { DetailTabelNummer: 1, Lift: 381,  Multiplier: 73.4975,  Revolutions: 0.8305 },
  { DetailTabelNummer: 1, Lift: 457,  Multiplier: 73.8415,  Revolutions: 0.9911 },
  { DetailTabelNummer: 1, Lift: 533,  Multiplier: 74.1838,  Revolutions: 1.1499 },
  { DetailTabelNummer: 1, Lift: 609,  Multiplier: 74.5233,  Revolutions: 1.3072 },
  { DetailTabelNummer: 1, Lift: 685,  Multiplier: 74.8611,  Revolutions: 1.4628 },
  { DetailTabelNummer: 1, Lift: 762,  Multiplier: 75.1977,  Revolutions: 1.6168 },
  { DetailTabelNummer: 1, Lift: 838,  Multiplier: 75.5323,  Revolutions: 1.7692 },
  { DetailTabelNummer: 1, Lift: 914,  Multiplier: 75.8641,  Revolutions: 1.9000 },
  { DetailTabelNummer: 1, Lift: 990,  Multiplier: 76.1953,  Revolutions: 2.0431 },
  { DetailTabelNummer: 1, Lift: 1066, Multiplier: 76.5243,  Revolutions: 2.1844 },
  { DetailTabelNummer: 1, Lift: 1143, Multiplier: 76.8512,  Revolutions: 2.3239 },
  { DetailTabelNummer: 1, Lift: 1219, Multiplier: 77.1786,  Revolutions: 2.4616 },
  { DetailTabelNummer: 1, Lift: 1295, Multiplier: 77.5061,  Revolutions: 2.5977 },
  { DetailTabelNummer: 1, Lift: 1371, Multiplier: 77.8312,  Revolutions: 2.7321 },
  // Table 2 (FF-HL-120)
  { DetailTabelNummer: 2, Lift: 152,  Multiplier: 77.917,   Revolutions: 0.3164 },
  { DetailTabelNummer: 2, Lift: 228,  Multiplier: 79.1439,  Revolutions: 0.4708 },
  { DetailTabelNummer: 2, Lift: 304,  Multiplier: 80.3504,  Revolutions: 0.6229 },
  { DetailTabelNummer: 2, Lift: 381,  Multiplier: 81.5391,  Revolutions: 0.7727 },
  { DetailTabelNummer: 2, Lift: 457,  Multiplier: 82.7126,  Revolutions: 0.9204 },
  { DetailTabelNummer: 2, Lift: 533,  Multiplier: 83.8683,  Revolutions: 1.0660 },
  { DetailTabelNummer: 2, Lift: 609,  Multiplier: 85.0087,  Revolutions: 1.2096 },
  { DetailTabelNummer: 2, Lift: 685,  Multiplier: 86.1314,  Revolutions: 1.3514 },
  { DetailTabelNummer: 2, Lift: 762,  Multiplier: 87.2439,  Revolutions: 1.4913 },
  { DetailTabelNummer: 2, Lift: 838,  Multiplier: 88.3387,  Revolutions: 1.6294 },
  { DetailTabelNummer: 2, Lift: 914,  Multiplier: 89.4232,  Revolutions: 1.7658 },
  { DetailTabelNummer: 2, Lift: 990,  Multiplier: 90.4926,  Revolutions: 1.9007 },
  { DetailTabelNummer: 2, Lift: 1066, Multiplier: 91.5492,  Revolutions: 2.0339 },
  { DetailTabelNummer: 2, Lift: 1143, Multiplier: 92.5957,  Revolutions: 2.1656 },
  { DetailTabelNummer: 2, Lift: 1219, Multiplier: 93.6295,  Revolutions: 2.2959 },
  { DetailTabelNummer: 2, Lift: 1295, Multiplier: 94.6531,  Revolutions: 2.4247 },
  { DetailTabelNummer: 2, Lift: 1371, Multiplier: 95.664,   Revolutions: 2.5521 },
  { DetailTabelNummer: 2, Lift: 1447, Multiplier: 96.6648,  Revolutions: 2.6782 },
  { DetailTabelNummer: 2, Lift: 1524, Multiplier: 97.6554,  Revolutions: 2.8031 },
  { DetailTabelNummer: 2, Lift: 1600, Multiplier: 98.6358,  Revolutions: 2.9266 },
  { DetailTabelNummer: 2, Lift: 1676, Multiplier: 99.6086,  Revolutions: 3.0490 },
  { DetailTabelNummer: 2, Lift: 1752, Multiplier: 100.5688, Revolutions: 3.1702 },
  { DetailTabelNummer: 2, Lift: 1828, Multiplier: 101.5213, Revolutions: 3.2901 },
  { DetailTabelNummer: 2, Lift: 1905, Multiplier: 102.4661, Revolutions: 3.4091 },
  { DetailTabelNummer: 2, Lift: 1981, Multiplier: 103.4009, Revolutions: 3.5269 },
  { DetailTabelNummer: 2, Lift: 2057, Multiplier: 104.328,  Revolutions: 3.6437 },
  { DetailTabelNummer: 2, Lift: 2133, Multiplier: 105.2474, Revolutions: 3.7594 },
  { DetailTabelNummer: 2, Lift: 2209, Multiplier: 106.1568, Revolutions: 3.8741 },
  { DetailTabelNummer: 2, Lift: 2286, Multiplier: 107.061,  Revolutions: 3.9879 },
  { DetailTabelNummer: 2, Lift: 2362, Multiplier: 107.9551, Revolutions: 4.1007 },
  { DetailTabelNummer: 2, Lift: 2438, Multiplier: 108.8441, Revolutions: 4.2126 },
  { DetailTabelNummer: 2, Lift: 2514, Multiplier: 109.7255, Revolutions: 4.3236 },
  { DetailTabelNummer: 2, Lift: 2590, Multiplier: 110.5992, Revolutions: 4.4336 },
  { DetailTabelNummer: 2, Lift: 2667, Multiplier: 111.4654, Revolutions: 4.5429 },
  { DetailTabelNummer: 2, Lift: 2743, Multiplier: 112.3264, Revolutions: 4.6513 },
  { DetailTabelNummer: 2, Lift: 2819, Multiplier: 113.1799, Revolutions: 4.7588 },
  { DetailTabelNummer: 2, Lift: 2895, Multiplier: 114.0257, Revolutions: 4.8656 },
  { DetailTabelNummer: 2, Lift: 2971, Multiplier: 114.869,  Revolutions: 4.9715 },
  { DetailTabelNummer: 2, Lift: 3048, Multiplier: 115.7021, Revolutions: 5.0767 },
  // Table 3 (FF-HL-164)
  { DetailTabelNummer: 3, Lift: 152,  Multiplier: 86.6267,  Revolutions: 0.2841 },
  { DetailTabelNummer: 3, Lift: 304,  Multiplier: 89.0473,  Revolutions: 0.5602 },
  { DetailTabelNummer: 3, Lift: 457,  Multiplier: 91.4019,  Revolutions: 0.8290 },
  { DetailTabelNummer: 3, Lift: 609,  Multiplier: 93.6981,  Revolutions: 1.0911 },
  { DetailTabelNummer: 3, Lift: 762,  Multiplier: 95.9409,  Revolutions: 1.3469 },
  { DetailTabelNummer: 3, Lift: 914,  Multiplier: 98.1304,  Revolutions: 1.5969 },
  { DetailTabelNummer: 3, Lift: 1066, Multiplier: 100.2741, Revolutions: 1.8414 },
  { DetailTabelNummer: 3, Lift: 1219, Multiplier: 102.3722, Revolutions: 2.0808 },
  { DetailTabelNummer: 3, Lift: 1371, Multiplier: 104.427,  Revolutions: 2.3154 },
  { DetailTabelNummer: 3, Lift: 1524, Multiplier: 106.4438, Revolutions: 2.5454 },
  { DetailTabelNummer: 3, Lift: 1676, Multiplier: 108.4224, Revolutions: 2.7712 },
  { DetailTabelNummer: 3, Lift: 1828, Multiplier: 110.3655, Revolutions: 2.9929 },
  { DetailTabelNummer: 3, Lift: 1981, Multiplier: 112.2731, Revolutions: 3.2108 },
  { DetailTabelNummer: 3, Lift: 2133, Multiplier: 114.1501, Revolutions: 3.4250 },
  { DetailTabelNummer: 3, Lift: 2286, Multiplier: 115.7453, Revolutions: 3.6358 },
  { DetailTabelNummer: 3, Lift: 2438, Multiplier: 117.7239, Revolutions: 3.8433 },
  { DetailTabelNummer: 3, Lift: 2590, Multiplier: 119.6061, Revolutions: 4.0476 },
  { DetailTabelNummer: 3, Lift: 2743, Multiplier: 121.3714, Revolutions: 4.2489 },
  { DetailTabelNummer: 3, Lift: 2895, Multiplier: 123.1087, Revolutions: 4.4473 },
  { DetailTabelNummer: 3, Lift: 3048, Multiplier: 124.8232, Revolutions: 4.6430 },
  { DetailTabelNummer: 3, Lift: 3200, Multiplier: 126.5149, Revolutions: 4.8360 },
  { DetailTabelNummer: 3, Lift: 3352, Multiplier: 128.1836, Revolutions: 5.0265 },
  { DetailTabelNummer: 3, Lift: 3505, Multiplier: 129.8321, Revolutions: 5.2145 },
  { DetailTabelNummer: 3, Lift: 3657, Multiplier: 131.4577, Revolutions: 5.4001 },
  { DetailTabelNummer: 3, Lift: 3810, Multiplier: 133.0655, Revolutions: 5.5835 },
  { DetailTabelNummer: 3, Lift: 3962, Multiplier: 134.653,  Revolutions: 5.7647 },
  { DetailTabelNummer: 3, Lift: 4114, Multiplier: 136.2227, Revolutions: 5.9438 },
  { DetailTabelNummer: 3, Lift: 4165, Multiplier: 136.7434, Revolutions: 6.0031 },
  // Table 4 (FF-54LC / Low Headroom)
  { DetailTabelNummer: 4, Lift: 152,  Multiplier: 54.9148,  Revolutions: 0.4520 },
  { DetailTabelNummer: 4, Lift: 228,  Multiplier: 56.1289,  Revolutions: 0.6705 },
  { DetailTabelNummer: 4, Lift: 381,  Multiplier: 58.4835,  Revolutions: 1.0937 },
  { DetailTabelNummer: 4, Lift: 457,  Multiplier: 59.6265,  Revolutions: 1.2991 },
  { DetailTabelNummer: 4, Lift: 533,  Multiplier: 60.7466,  Revolutions: 1.5006 },
  { DetailTabelNummer: 4, Lift: 609,  Multiplier: 61.849,   Revolutions: 1.6984 },
  { DetailTabelNummer: 4, Lift: 685,  Multiplier: 62.9285,  Revolutions: 1.8928 },
  { DetailTabelNummer: 4, Lift: 762,  Multiplier: 63.9928,  Revolutions: 2.0839 },
  { DetailTabelNummer: 4, Lift: 838,  Multiplier: 65.0367,  Revolutions: 2.2719 },
  { DetailTabelNummer: 4, Lift: 914,  Multiplier: 66.0679,  Revolutions: 2.4569 },
  { DetailTabelNummer: 4, Lift: 990,  Multiplier: 67.0814,  Revolutions: 2.6391 },
  { DetailTabelNummer: 4, Lift: 1066, Multiplier: 68.0796,  Revolutions: 2.8185 },
  { DetailTabelNummer: 4, Lift: 1143, Multiplier: 69.0626,  Revolutions: 2.9954 },
  { DetailTabelNummer: 4, Lift: 1219, Multiplier: 70.0329,  Revolutions: 3.1698 },
  { DetailTabelNummer: 4, Lift: 1295, Multiplier: 70.9879,  Revolutions: 3.3418 },
  { DetailTabelNummer: 4, Lift: 1371, Multiplier: 71.9328,  Revolutions: 3.5115 },
  // Table 9 (FF-VL series) - Vertical Lift
  { DetailTabelNummer: 9, Lift: 25,   Multiplier: 25.4,     Revolutions: 1.0000 },
  { DetailTabelNummer: 9, Lift: 152,  Multiplier: 40.3352,  Revolutions: 0.6514 },
  { DetailTabelNummer: 9, Lift: 304,  Multiplier: 45.7073,  Revolutions: 1.2152 },
  { DetailTabelNummer: 9, Lift: 457,  Multiplier: 50.5079,  Revolutions: 1.7194 },
  { DetailTabelNummer: 9, Lift: 609,  Multiplier: 54.8919,  Revolutions: 2.1797 },
  { DetailTabelNummer: 9, Lift: 762,  Multiplier: 58.9509,  Revolutions: 2.6058 },
  { DetailTabelNummer: 9, Lift: 914,  Multiplier: 62.7507,  Revolutions: 3.0044 },
  { DetailTabelNummer: 9, Lift: 1066, Multiplier: 66.327,   Revolutions: 3.3802 },
  { DetailTabelNummer: 9, Lift: 1219, Multiplier: 69.723,   Revolutions: 3.7368 },
  { DetailTabelNummer: 9, Lift: 1371, Multiplier: 72.9615,  Revolutions: 4.0768 },
  { DetailTabelNummer: 9, Lift: 1524, Multiplier: 76.0628,  Revolutions: 4.4023 },
  { DetailTabelNummer: 9, Lift: 1676, Multiplier: 79.0423,  Revolutions: 4.7150 },
  { DetailTabelNummer: 9, Lift: 1828, Multiplier: 81.9125,  Revolutions: 5.0164 },
  { DetailTabelNummer: 9, Lift: 1981, Multiplier: 84.6861,  Revolutions: 5.3076 },
  { DetailTabelNummer: 9, Lift: 2133, Multiplier: 87.3709,  Revolutions: 5.5895 },
  { DetailTabelNummer: 9, Lift: 2286, Multiplier: 89.977,   Revolutions: 5.8631 },
  { DetailTabelNummer: 9, Lift: 2438, Multiplier: 92.5093,  Revolutions: 6.1289 },
  { DetailTabelNummer: 9, Lift: 2590, Multiplier: 94.9731,  Revolutions: 6.3877 },
  { DetailTabelNummer: 9, Lift: 2743, Multiplier: 97.376,   Revolutions: 6.6399 },
  { DetailTabelNummer: 9, Lift: 2895, Multiplier: 99.7204,  Revolutions: 6.8860 },
  { DetailTabelNummer: 9, Lift: 3048, Multiplier: 102.0115, Revolutions: 7.1264 },
  { DetailTabelNummer: 9, Lift: 3200, Multiplier: 104.2518, Revolutions: 7.3616 },
  { DetailTabelNummer: 9, Lift: 3352, Multiplier: 106.4438, Revolutions: 7.5919 },
  { DetailTabelNummer: 9, Lift: 3429, Multiplier: 107.5233, Revolutions: 7.7052 },
  { DetailTabelNummer: 9, Lift: 3505, Multiplier: 108.5926, Revolutions: 7.8175 },
  { DetailTabelNummer: 9, Lift: 3657, Multiplier: 110.7008, Revolutions: 8.0387 },
  { DetailTabelNummer: 9, Lift: 3810, Multiplier: 112.7684, Revolutions: 8.2558 },
  { DetailTabelNummer: 9, Lift: 3962, Multiplier: 114.7978, Revolutions: 8.4689 },
  { DetailTabelNummer: 9, Lift: 4114, Multiplier: 116.7943, Revolutions: 8.6784 },
  { DetailTabelNummer: 9, Lift: 4267, Multiplier: 118.7552, Revolutions: 8.8843 },
  { DetailTabelNummer: 9, Lift: 4419, Multiplier: 120.6856, Revolutions: 9.0869 },
  { DetailTabelNummer: 9, Lift: 4572, Multiplier: 122.5829, Revolutions: 9.2864 },
  { DetailTabelNummer: 9, Lift: 4724, Multiplier: 124.4549, Revolutions: 9.4827 },
  { DetailTabelNummer: 9, Lift: 4876, Multiplier: 126.2964, Revolutions: 9.6762 },
  { DetailTabelNummer: 9, Lift: 5029, Multiplier: 128.1125, Revolutions: 9.8669 },
  { DetailTabelNummer: 9, Lift: 5181, Multiplier: 129.9032, Revolutions: 10.0549 },
  { DetailTabelNummer: 9, Lift: 5334, Multiplier: 131.6711, Revolutions: 10.2403 },
  { DetailTabelNummer: 9, Lift: 5486, Multiplier: 133.4135, Revolutions: 10.4233 },
  { DetailTabelNummer: 9, Lift: 5638, Multiplier: 135.3363, Revolutions: 10.5419 },
  { DetailTabelNummer: 9, Lift: 5791, Multiplier: 137.033,  Revolutions: 10.7200 },
  { DetailTabelNummer: 9, Lift: 5943, Multiplier: 138.7094, Revolutions: 10.8960 },
  { DetailTabelNummer: 9, Lift: 6096, Multiplier: 140.3655, Revolutions: 11.0698 },
  { DetailTabelNummer: 9, Lift: 6248, Multiplier: 142.0012, Revolutions: 11.2416 },
  { DetailTabelNummer: 9, Lift: 6400, Multiplier: 143.6192, Revolutions: 11.4114 },
  { DetailTabelNummer: 9, Lift: 6553, Multiplier: 145.2194, Revolutions: 11.5794 },
  { DetailTabelNummer: 9, Lift: 6705, Multiplier: 146.8018, Revolutions: 11.7455 },
  { DetailTabelNummer: 9, Lift: 6858, Multiplier: 148.3665, Revolutions: 11.9098 },
  { DetailTabelNummer: 9, Lift: 7010, Multiplier: 149.9159, Revolutions: 12.0725 },
  { DetailTabelNummer: 9, Lift: 7162, Multiplier: 151.4475, Revolutions: 12.2334 },
  { DetailTabelNummer: 9, Lift: 7315, Multiplier: 152.9664, Revolutions: 12.3928 },
  { DetailTabelNummer: 9, Lift: 7467, Multiplier: 154.4701, Revolutions: 12.5506 },
  { DetailTabelNummer: 9, Lift: 7620, Multiplier: 155.9585, Revolutions: 12.7069 },
  { DetailTabelNummer: 9, Lift: 7772, Multiplier: 157.4317, Revolutions: 12.8617 },
  { DetailTabelNummer: 9, Lift: 7924, Multiplier: 158.8922, Revolutions: 13.0150 },
  { DetailTabelNummer: 9, Lift: 8077, Multiplier: 160.34,   Revolutions: 13.1670 },
  { DetailTabelNummer: 9, Lift: 8229, Multiplier: 161.7751, Revolutions: 13.3176 },
  { DetailTabelNummer: 9, Lift: 8382, Multiplier: 163.1975, Revolutions: 13.4668 },
  { DetailTabelNummer: 9, Lift: 8534, Multiplier: 164.6072, Revolutions: 13.6148 },
];

// ─────────────────────────────────────────────
// 5. VERİ: NAME_MAP (FF -> KUT dönüşüm tablosu)
// ─────────────────────────────────────────────
export const NAME_MAP: Record<string, string> = {
  "FF-NL-12":  "FFNL13",  "FF05NL12":  "FFNL13",
  "FF-NL-18":  "FFNL18",  "FF05NL18":  "FFNL18",
  "FF-NL-32":  "FFNL32",  "FF05NL32":  "FFNL32",
  "FF-HL-54":  "FFHL54",  "FF05HL54":  "FFHL54",
  "FF-HL-120": "FFHL120", "FF05HL120": "FFHL120",
  "FF-HL-164": "FFHL164", "FF05HL164": "FFHL164",
  "FF-VL-11":  "FFVL11",  "FF05VL11":  "FFVL11",
  "FF-VL-18":  "FFVL18",  "FF05VL18":  "FFVL18",
  "FF-VL-28":  "FFVL28",
};

// ─────────────────────────────────────────────
// 6. VERİ: Fiyat kitabı (v1.13'ten birebir)
// ─────────────────────────────────────────────
const PRICE_BOOK: Record<string, { stock: number; eur: number }> = {
  "4.50x51":  { stock: 3000, eur: 52.46 },
  "5.00x51":  { stock: 3250, eur: 69.04 },
  "5.50x51":  { stock: 3250, eur: 76.48 },
  "6.00x51":  { stock: 3000, eur: 77.73 },
  "6.50x67":  { stock: 3000, eur: 108.70 },
  "7.00x67":  { stock: 3250, eur: 127.13 },
  "6.50x95":  { stock: 3250, eur: 162.39 },
  "7.00x95":  { stock: 3000, eur: 162.39 },
  "7.50x95":  { stock: 3250, eur: 189.51 },
  "8.00x95":  { stock: 3250, eur: 202.87 },
  "8.50x95":  { stock: 3000, eur: 200.11 },
  "9.00x95":  { stock: 3000, eur: 212.65 },
  "9.50x95":  { stock: 3250, eur: 245.21 },
  "7.50x152": { stock: 3000, eur: 271.87 },
  "8.00x152": { stock: 3000, eur: 291.12 },
  "8.50x152": { stock: 3000, eur: 309.97 },
  "9.00x152": { stock: 3250, eur: 357.01 },
  "9.50x152": { stock: 2750, eur: 319.35 },
  "10.00x152":{ stock: 2750, eur: 337.44 },
  "10.50x152":{ stock: 3250, eur: 420.21 },
  "11.00x152":{ stock: 3250, eur: 441.40 },
  "11.50x152":{ stock: 3250, eur: 465.42 },
};

// ─────────────────────────────────────────────
// 7. YARDIMCI FONKSİYONLAR (v1.13'ten birebir)
// ─────────────────────────────────────────────

/** FF inch değerini mm'ye çevirir */
function mmDiameter(inch: number): number {
  if (Math.abs(inch - 2) < 0.05) return 51;
  if (Math.abs(inch - 2.63) < 0.08) return 67;
  if (Math.abs(inch - 3.75) < 0.08) return 95;
  if (Math.abs(inch - 6) < 0.08) return 152;
  return Math.round(inch * 25.4);
}

/** İnaktif sarım boyu (standart) */
function inactiveMM(D: number): number {
  if (D === 95) return 57;
  if (D === 152) return 35;
  if (D === 67) return 48;
  if (D === 51) return 42;
  return 40;
}

/** İnaktif sarım boyu (Low Headroom) */
function inactiveMMLHR(d: number, D: number): number {
  if (D === 152) {
    if (d >= 10) return 100;
    if (d >= 8.5) return 85;
    return 70;
  }
  if (D === 95) {
    if (d >= 9) return 85;
    if (d >= 7.5) return 70;
    return 57;
  }
  if (D === 67) {
    if (d >= 7) return 70;
    return 55;
  }
  return inactiveMM(D) + 13;
}

/** Boyu 20'nin tek katlarına (10,30,50,...) yuvarlar */
function round20odd(x: number): number {
  return Math.round((x - 10) / 20) * 20 + 10;
}

/** 10k çevrim moment limiti */
function moment10k(vid: number): number | null {
  const d = SPRING_DETAILS.find(x => x.VeerId === vid && x.Uitvoering === 0);
  return d ? d.Moment10k : null;
}

/** Çevrim ömrünü belirler */
function lifeLegacy(vid: number, moment: number): number | null {
  const rows = SPRING_DETAILS.filter(x => x.VeerId === vid && x.Uitvoering === 0);
  if (!rows.length) return null;
  const r = rows[0];
  if (moment <= r.Moment50k) return 50000;
  if (moment <= r.Moment25k) return 25000;
  if (moment <= r.Moment15k) return 15000;
  if (moment <= r.Moment10k) return 10000;
  return null;
}

/** Tambur adını FF -> KUT formatına çevirir */
export function currentName(s: string): string {
  const n = NAME_MAP[s] || s.replaceAll('-', '');
  return n.replace(/^FF/i, 'KUT');
}

/** Halat çapını kapı ağırlığından belirler */
export function cableDia(weight: number): number {
  if (weight <= 163) return 3;
  if (weight <= 321) return 4;
  if (weight <= 490) return 5;
  return 6;
}

/** Detail tablosunda lineer interpolasyon */
export function interpDetail(tableNo: number, lift: number): DrumDetail | null {
  const a = DRUM_DETAILS.filter(x => x.DetailTabelNummer === tableNo)
    .sort((x, y) => x.Lift - y.Lift);
  if (!a.length) return null;
  if (lift <= a[0].Lift) return a[0];
  if (lift >= a[a.length - 1].Lift) return a[a.length - 1];
  for (let i = 0; i < a.length - 1; i++) {
    const x = a[i], y = a[i + 1];
    if (lift >= x.Lift && lift <= y.Lift) {
      const t = (lift - x.Lift) / (y.Lift - x.Lift);
      return {
        DetailTabelNummer: tableNo,
        Lift: lift,
        Multiplier: x.Multiplier + t * (y.Multiplier - x.Multiplier),
        Revolutions: x.Revolutions + t * (y.Revolutions - x.Revolutions),
      };
    }
  }
  return null;
}

/** Uygun tambur filtresi */
function drumAllowedForSystem(d: Drum, sys: string, weight: number, h: number, hl: number, cable: number): boolean {
  if (d.Asdiameter !== 0) return false;
  if (d.MaxGewicht < weight) return false;
  if (d.MaxKabeldikte < cable) return false;
  if (sys === 'Normal Lift' || sys === 'Low Headroom') {
    return d.KabeltrommelSoort === 0;
  }
  if (sys === 'High Lift') {
    return d.KabeltrommelSoort === 1 && d.MaxHilift >= hl && d.MaxHoogte >= h && d.DetailTabelNummer > 0;
  }
  if (sys === 'Vertical Lift') {
    return d.KabeltrommelSoort === 2;
  }
  return false;
}

export function suitableDrums(sys: string, weight: number, h: number, hl: number, cable: number): Drum[] {
  return DRUMS.filter(d => drumAllowedForSystem(d, sys, weight, h, hl, cable))
    .sort((a, b) => a.Volgorde - b.Volgorde || a.MaxGewicht - b.MaxGewicht);
}

function chooseNormal(weight: number, h: number, cable: number): Drum | null {
  const family = h <= 4250 ? 'FF-NL-12' : (h <= 5570 ? 'FF-NL-18' : 'FF-NL-32');
  const d = DRUMS.find(x => x.Kabeltrommeltype === family);
  if (d && d.MaxGewicht >= weight && d.MaxKabeldikte >= cable) return d;
  return DRUMS.filter(x => x.KabeltrommelSoort === 0 && x.MaxGewicht >= weight && x.MaxKabeldikte >= cable)
    .sort((a, b) => a.Volgorde - b.Volgorde)[0] || null;
}

function chooseHL(weight: number, h: number, hl: number, cable: number, bottom: number): Drum | null {
  const a = DRUMS.filter(d =>
    d.KabeltrommelSoort === 1 &&
    d.MaxGewicht >= weight &&
    d.MaxHilift >= hl &&
    d.MaxKabeldikte >= cable &&
    d.MaxHoogte >= (h - bottom) &&
    d.DetailTabelNummer > 0
  );
  return a.sort((x, y) => x.Volgorde - y.Volgorde)[0] || null;
}

function chooseVL(weight: number, h: number, cable: number): Drum | null {
  const family = h <= 3300 ? 'FF-VL-11' : (h <= 6000 ? 'FF-VL-18' : 'FF-VL-28');
  const d = DRUMS.find(x => x.Kabeltrommeltype === family);
  if (d && d.MaxGewicht >= weight && d.MaxKabeldikte >= cable) return d;
  return DRUMS.filter(x => x.KabeltrommelSoort === 2 && x.MaxGewicht >= weight && x.MaxKabeldikte >= cable)
    .sort((a, b) => a.Volgorde - b.Volgorde)[0] || null;
}

function lowHeadroomOpenWeight(wmm: number, hmm: number, kgm2: number, bottom: number): number {
  const wm = wmm / 1000;
  const dh = (hmm - 2500) / 1000;
  return wm * kgm2 * (0.3169863 + 0.01230137 * dh) + 0.82315068;
}

function normalOpenWeight(wmm: number, hmm: number): number {
  const w = wmm / 1000, h = hmm / 1000;
  return 4.11175 * w + 0.229 * w * h + 1.04425;
}

function normalTravelCorrection(wmm: number, hmm: number): number {
  const w = wmm / 1000;
  const pts: Record<number, [number, number]> = {
    3000: [0.989993, 0.001909],
    4000: [0.989878, 0.001477],
    5000: [0.995180, 0.001223],
    6000: [1.005190, 0.001070],
  };
  const hs = Object.keys(pts).map(Number).sort((a, b) => a - b);
  let h1 = hs[0], h2 = hs[hs.length - 1];
  for (let i = 0; i < hs.length - 1; i++) {
    if (hmm >= hs[i] && hmm <= hs[i + 1]) { h1 = hs[i]; h2 = hs[i + 1]; break; }
  }
  const t = h2 === h1 ? 0 : (hmm - h1) / (h2 - h1);
  const a = pts[h1][0] + t * (pts[h2][0] - pts[h1][0]);
  const b = pts[h1][1] + t * (pts[h2][1] - pts[h1][1]);
  return a + b * (w - 3);
}

export function cableLengthMM(sys: string, drum: Drum, h: number): number {
  if (sys === 'Low Headroom') {
    const lhrCorrection: Record<string, number> = {
      "FF-NL-12": 1962, "FF05NL12": 1962,
      "FF-NL-18": 2177, "FF05NL18": 2177,
      "FF-NL-32": 2702, "FF05NL32": 2702,
    };
    return h * 2 + (lhrCorrection[drum.Kabeltrommeltype] || 2000);
  }
  const correction: Record<string, number> = {
    "FF-NL-12": 1170, "FF05NL12": 1170,
    "FF-NL-18": 1390, "FF05NL18": 1390,
    "FF-NL-32": 1901, "FF05NL32": 1901,
    "FF-HL-120": 4841, "FF05HL120": 4841,
    "FF-HL-164": 6221, "FF05HL164": 6221,
    "FF-VL-11": 5212, "FF05VL11": 5212,
    "FF-VL-18": 8407, "FF05VL18": 8407,
  };
  return h + (correction[drum.Kabeltrommeltype] || drum.KabelCorrectie);
}

/** Fiyata göre sıralama için maliyet skoru */
function springCostEUR(r: SpringResult): number {
  const key = r.d.toFixed(2) + 'x' + r.D;
  const p = PRICE_BOOK[key];
  if (!p) return Number.POSITIVE_INFINITY;
  return (p.eur / p.stock) * r.L;
}

// ─────────────────────────────────────────────
// 8. SONUÇ TİPİ
// ─────────────────────────────────────────────
export interface SpringResult {
  d: number;   // tel çapı mm
  D: number;   // iç çap mm
  L: number;   // boy mm
  rate: number;   // rijitlik Nmm/turn
  moment: number; // moment Nmm
  life: number | null;
}

export interface CalcResult {
  weight: number;
  cable: number;
  drum: Drum;
  turns: number;
  closedTorque: number;
  totalRate: number;
  perTorque: number;
  targetRate: number;
  cableLength: number;
  springs: SpringResult[];
  error?: string;
}

// ─────────────────────────────────────────────
// 9. YAY ÇÖZÜMÜ BULUCU (v1.13'ten birebir)
// ─────────────────────────────────────────────
function springSolutions(
  targetRate: number,
  turns: number,
  perTorque: number,
  mode: string
): SpringResult[] {
  const rows: SpringResult[] = [];
  for (const s of SPRINGS) {
    const d = s.Draaddikte;
    const D = mmDiameter(s.Diameter);
    if (Math.abs(d * 2 - Math.round(d * 2)) > 1e-8) continue;
    const m10 = moment10k(s.Veerid);
    if (m10 && m10 < perTorque * 0.98) continue;
    const extra = mode === 'Low Headroom' ? inactiveMMLHR(d, D) : inactiveMM(D);
    const raw = (s.VeerConstante / targetRate) * d + extra;
    const L = round20odd(raw);
    if (L < 500 || L > 1830) continue;
    const active = (L - extra) / d;
    if (active <= 0) continue;
    const rate = s.VeerConstante / active;
    const moment = rate * turns;
    if (m10 && moment > m10 * 1.035) continue;
    rows.push({ d, D, L, rate, moment, life: lifeLegacy(s.Veerid, moment) });
  }
  rows.sort((a, b) => a.d - b.d || a.D - b.D);
  return rows;
}

// ─────────────────────────────────────────────
// 10. ANA HESAPLAMA FONKSİYONU
// ─────────────────────────────────────────────
export interface CalcInput {
  sys: 'Normal Lift' | 'Low Headroom' | 'High Lift' | 'Vertical Lift';
  w: number;   // genişlik mm
  h: number;   // yükseklik mm
  hl: number;  // high lift mm
  kgm2: number;
  qty: number; // yay adedi 1-4
  manualDrum?: string; // manuel tambur seçimi
}

const g = 9.81;

export function calculate(input: CalcInput): CalcResult {
  const { sys, w, h, hl, kgm2, qty, manualDrum } = input;

  if (sys === 'High Lift' && hl > h) {
    return { weight: 0, cable: 0, drum: DRUMS[0], turns: 0, closedTorque: 0, totalRate: 0, perTorque: 0, targetRate: 0, cableLength: 0, springs: [], error: `High Lift yüksekliği (${hl} mm) kapı yüksekliğinden (${h} mm) büyük olamaz.` };
  }

  const bottom = sys === 'Low Headroom' ? 500 : 610;
  const weight = (w * h / 1e6) * kgm2;
  const cable = cableDia(weight);

  let drum: Drum | null = null;
  let turns = 0;
  let closedTorque = 0;
  let totalRate = 0;

  if (sys === 'High Lift') {
    const autoDrum = chooseHL(weight, h, hl, cable, bottom);
    if (!autoDrum) return { weight, cable, drum: DRUMS[0], turns, closedTorque, totalRate, perTorque: 0, targetRate: 0, cableLength: 0, springs: [], error: 'Uygun High Lift tamburu bulunamadı.' };
    drum = manualDrum ? (DRUMS.find(d => d.Kabeltrommeltype === manualDrum) || autoDrum) : autoDrum;
    const sections = Math.ceil(h / bottom);
    const avgSection = h / sections;
    const det = interpDetail(drum.DetailTabelNummer, hl);
    if (!det) return { weight, cable, drum, turns, closedTorque, totalRate, perTorque: 0, targetRate: 0, cableLength: 0, springs: [], error: 'Tambur detail tablosu bulunamadı.' };
    const verticalLen = Math.min(h, hl + 0.10 * avgSection);
    const openWeight = weight * verticalLen / h;
    closedTorque = weight * g * det.Multiplier;
    const openTorque = openWeight * g * drum.LiftArmFlatMoment;
    const flatCirc = drum.OmtrekVlak + Math.PI * cable;
    const travelRev = det.Revolutions + Math.max(0, h - hl) / flatCirc;
    totalRate = (closedTorque - openTorque) / travelRev;
    turns = closedTorque / totalRate;
  } else if (sys === 'Normal Lift') {
    const autoDrum = chooseNormal(weight, h, cable);
    if (!autoDrum) return { weight, cable, drum: DRUMS[0], turns, closedTorque, totalRate, perTorque: 0, targetRate: 0, cableLength: 0, springs: [], error: 'Uygun Normal Lift tamburu bulunamadı.' };
    drum = manualDrum ? (DRUMS.find(d => d.Kabeltrommeltype === manualDrum) || autoDrum) : autoDrum;
    const openWeight = normalOpenWeight(w, h);
    closedTorque = weight * g * drum.LiftArmHiMoment;
    const openTorque = openWeight * g * drum.LiftArmFlatMoment;
    const travelRev = (h / drum.OmtrekVlak) * normalTravelCorrection(w, h);
    totalRate = (closedTorque - openTorque) / travelRev;
    turns = closedTorque / totalRate;
  } else if (sys === 'Low Headroom') {
    const autoDrum = chooseNormal(weight, h, cable);
    if (!autoDrum) return { weight, cable, drum: DRUMS[0], turns, closedTorque, totalRate, perTorque: 0, targetRate: 0, cableLength: 0, springs: [], error: 'Uygun Low Headroom tamburu bulunamadı.' };
    drum = manualDrum ? (DRUMS.find(d => d.Kabeltrommeltype === manualDrum) || autoDrum) : autoDrum;
    const openWeight = lowHeadroomOpenWeight(w, h, kgm2, bottom);
    closedTorque = weight * g * drum.LiftArmHiMoment;
    turns = 1 + 0.003 * h;
    totalRate = closedTorque / turns;
  } else if (sys === 'Vertical Lift') {
    const autoDrum = chooseVL(weight, h, cable);
    if (!autoDrum) return { weight, cable, drum: DRUMS[0], turns, closedTorque, totalRate, perTorque: 0, targetRate: 0, cableLength: 0, springs: [], error: 'Uygun Vertical Lift tamburu bulunamadı.' };
    drum = manualDrum ? (DRUMS.find(d => d.Kabeltrommeltype === manualDrum) || autoDrum) : autoDrum;
    const det = interpDetail(9, h);
    if (!det) return { weight, cable, drum, turns, closedTorque, totalRate, perTorque: 0, targetRate: 0, cableLength: 0, springs: [], error: 'VL detail tablosu bulunamadı.' };
    closedTorque = weight * g * det.Multiplier;
    turns = det.Revolutions + 3.57;
    totalRate = closedTorque / turns;
  } else {
    return { weight: 0, cable: 0, drum: DRUMS[0], turns: 0, closedTorque: 0, totalRate: 0, perTorque: 0, targetRate: 0, cableLength: 0, springs: [], error: 'Bilinmeyen yataklama sistemi.' };
  }

  const cableLength = cableLengthMM(sys, drum, h);
  const perTorque = closedTorque / qty;
  const targetRate = totalRate / qty;

  let springs = springSolutions(targetRate, turns, perTorque, sys);
  springs.sort((a, b) => {
    const ca = springCostEUR(a), cb = springCostEUR(b);
    if (ca !== cb) return ca - cb;
    return a.d - b.d || a.D - b.D || a.L - b.L;
  });
  springs = springs.slice(0, 8);

  return { weight, cable, drum, turns, closedTorque, totalRate, perTorque, targetRate, cableLength, springs };
}

/** Yay adedine göre etiket listesi döner */
export function springLabels(qty: number): string[] {
  if (qty === 1) return ['SAĞ YAY'];
  if (qty === 2) return ['SAĞ YAY', 'SOL YAY'];
  if (qty === 3) return ['SAĞ YAY', 'SOL 1 YAY', 'SOL 2 YAY'];
  if (qty === 4) return ['SAĞ 1 YAY', 'SAĞ 2 YAY', 'SOL 1 YAY', 'SOL 2 YAY'];
  return Array.from({ length: qty }, (_, i) => `YAY ${i + 1}`);
}
