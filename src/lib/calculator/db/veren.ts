export interface FFSpringDef {
  veerId: number;
  status: number; // 0 = standard, 1 = custom
  c: number; // VeerConstante in Nmm*mm/turn
  d: number; // Draaddikte in mm
  diInch: number; // Inner diameter in inches
  diMm: number; // Inner diameter in mm (approx 51, 67, 95, 152)
  weightPerMm: number; // Gewicht in kg/mm
}

export const FF_VEREN: FFSpringDef[] = [
  { veerId: 2,  status: 0, c: 2.2777741e5, d: 5.00, diInch: 2.00, diMm: 51,  weightPerMm: 5.407e-3 },
  { veerId: 3,  status: 1, c: 2.80089385e5, d: 5.25, diInch: 2.00, diMm: 51, weightPerMm: 5.703e-3 },
  { veerId: 4,  status: 0, c: 3.32401359e5, d: 5.50, diInch: 2.00, diMm: 51, weightPerMm: 6.001e-3 },
  { veerId: 44, status: 0, c: 1.4981788e5, d: 4.50, diInch: 2.00, diMm: 51, weightPerMm: 4.822e-3 },
  { veerId: 6,  status: 1, c: 3.96689725e5, d: 5.75, diInch: 2.00, diMm: 51, weightPerMm: 6.301e-3 },
  { veerId: 7,  status: 0, c: 4.60978092e5, d: 6.00, diInch: 2.00, diMm: 51, weightPerMm: 6.604e-3 },
  { veerId: 45, status: 1, c: 1.88797645e5, d: 4.75, diInch: 2.00, diMm: 51, weightPerMm: 5.113e-3 },
  { veerId: 10, status: 0, c: 4.9464757e5, d: 6.50, diInch: 2.63, diMm: 67,  weightPerMm: 9.217e-3 },
  { veerId: 11, status: 0, c: 3.55789218e5, d: 6.50, diInch: 3.75, diMm: 95, weightPerMm: 1.2817e-2 },
  { veerId: 12, status: 1, c: 5.7774791e5, d: 6.75, diInch: 2.63, diMm: 67,  weightPerMm: 9.605e-3 },
  { veerId: 13, status: 1, c: 4.17365949e5, d: 6.75, diInch: 3.75, diMm: 95, weightPerMm: 1.3342e-2 },
  { veerId: 14, status: 0, c: 6.60848249e5, d: 7.00, diInch: 2.63, diMm: 67,  weightPerMm: 9.994e-3 },
  { veerId: 15, status: 0, c: 4.78942679e5, d: 7.00, diInch: 3.75, diMm: 95, weightPerMm: 1.3871e-2 },
  { veerId: 16, status: 1, c: 5.50575059e5, d: 7.25, diInch: 3.75, diMm: 95, weightPerMm: 1.4401e-2 },
  { veerId: 18, status: 0, c: 6.22207439e5, d: 7.50, diInch: 3.75, diMm: 95, weightPerMm: 1.4934e-2 },
  { veerId: 19, status: 0, c: 3.99740316e5, d: 7.50, diInch: 6.00, diMm: 152, weightPerMm: 2.3240e-2 },
  { veerId: 20, status: 1, c: 7.13555671e5, d: 7.75, diInch: 3.75, diMm: 95, weightPerMm: 1.5469e-2 },
  { veerId: 21, status: 1, c: 4.58944365e5, d: 7.75, diInch: 6.00, diMm: 152, weightPerMm: 2.4053e-2 },
  { veerId: 22, status: 0, c: 8.04903903e5, d: 8.00, diInch: 3.75, diMm: 95, weightPerMm: 1.6007e-2 },
  { veerId: 23, status: 0, c: 5.18148414e5, d: 8.00, diInch: 6.00, diMm: 152, weightPerMm: 2.4867e-2 },
  { veerId: 24, status: 1, c: 9.14725154e5, d: 8.25, diInch: 3.75, diMm: 95, weightPerMm: 1.6547e-2 },
  { veerId: 25, status: 1, c: 5.89385347e5, d: 8.25, diInch: 6.00, diMm: 152, weightPerMm: 2.5684e-2 },
  { veerId: 26, status: 0, c: 1.024546405e6, d: 8.50, diInch: 3.75, diMm: 95, weightPerMm: 1.7090e-2 },
  { veerId: 27, status: 0, c: 6.6062228e5, d: 8.50, diInch: 6.00, diMm: 152, weightPerMm: 2.6504e-2 },
  { veerId: 28, status: 1, c: 1.148095313e6, d: 8.75, diInch: 3.75, diMm: 95, weightPerMm: 1.7635e-2 },
  { veerId: 29, status: 1, c: 7.40954491e5, d: 8.75, diInch: 6.00, diMm: 152, weightPerMm: 2.7326e-2 },
  { veerId: 30, status: 0, c: 1.271644221e6, d: 9.00, diInch: 3.75, diMm: 95, weightPerMm: 1.8182e-2 },
  { veerId: 31, status: 0, c: 8.21286703e5, d: 9.00, diInch: 6.00, diMm: 152, weightPerMm: 2.8150e-2 },
  { veerId: 32, status: 1, c: 1.424117244e6, d: 9.25, diInch: 3.75, diMm: 95, weightPerMm: 1.8732e-2 },
  { veerId: 33, status: 1, c: 9.20656858e5, d: 9.25, diInch: 6.00, diMm: 152, weightPerMm: 2.8977e-2 },
  { veerId: 34, status: 0, c: 1.576590267e6, d: 9.50, diInch: 3.75, diMm: 95, weightPerMm: 1.9285e-2 },
  { veerId: 35, status: 0, c: 1.020027012e6, d: 9.50, diInch: 6.00, diMm: 152, weightPerMm: 2.9806e-2 },
  { veerId: 36, status: 1, c: 1.136231906e6, d: 9.75, diInch: 6.00, diMm: 152, weightPerMm: 3.0638e-2 },
  { veerId: 37, status: 0, c: 1.2524368e6, d: 10.00, diInch: 6.00, diMm: 152, weightPerMm: 3.1472e-2 },
  { veerId: 38, status: 1, c: 1.379996669e6, d: 10.25, diInch: 6.00, diMm: 152, weightPerMm: 3.2308e-2 },
  { veerId: 39, status: 0, c: 1.507556538e6, d: 10.50, diInch: 6.00, diMm: 152, weightPerMm: 3.3147e-2 },
  { veerId: 40, status: 1, c: 1.661724334e6, d: 10.75, diInch: 6.00, diMm: 152, weightPerMm: 3.3988e-2 },
  { veerId: 41, status: 0, c: 1.815892129e6, d: 11.00, diInch: 6.00, diMm: 152, weightPerMm: 3.4832e-2 },
  { veerId: 42, status: 1, c: 1.992204951e6, d: 11.25, diInch: 6.00, diMm: 152, weightPerMm: 3.5678e-2 },
  { veerId: 43, status: 0, c: 2.168517772e6, d: 11.50, diInch: 6.00, diMm: 152, weightPerMm: 3.6527e-2 },
];
