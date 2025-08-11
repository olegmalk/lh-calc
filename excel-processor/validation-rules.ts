// Auto-generated validation rules from Excel analysis
// Generated on: 2025-08-09 17:46:02.790173

export interface ValidationRule {
  type: 'string' | 'number' | 'enum' | 'any';
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  values?: string[];
  description?: string;
}

export interface FieldContext {
  address: string;
  sheet: string;
  color: string;
  sample_value: any;
  row_headers: string[];
  column_headers: string[];
}

export interface ValidationRules {
  [fieldKey: string]: {
    validation: ValidationRule;
    context: FieldContext;
  };
}

export const VALIDATION_RULES: ValidationRules = {
  "tech_D27_sequenceNumber":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "D27",
      sheet: "технолог",
      color: "FF92D050",
      sample_value: 1,
      row_headers: [],
      column_headers: ["Исходные заполяет технолог", "номер у технолога"]
    }
  },

  "tech_E27_customerOrderPosition":
    validation: {
      type: "string",
      required: true,
      pattern: "^[ЕК][-0-9А-Я*]*$",
      description: "Auto-detected from equipment_code pattern"
    },
    context: {
      address: "E27",
      sheet: "технолог",
      color: "FF92D050",
      sample_value: 'Е-113',
      row_headers: [],
      column_headers: ["Номер позиции в ОЛ Заказчика"]
    }
  },

  "tech_H27_passes":
    validation: {
      type: "string",
      required: true,
      pattern: "^\d+\/\d+$",
      description: "Auto-detected from fraction pattern"
    },
    context: {
      address: "H27",
      sheet: "технолог",
      color: "FF92D050",
      sample_value: '1/6',
      row_headers: ["Е-113", "Целый ТА", "К4-750"],
      column_headers: ["ходы"]
    }
  },

  "tech_I27_plateQuantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "I27",
      sheet: "технолог",
      color: "FF92D050",
      sample_value: 400,
      row_headers: ["Целый ТА", "К4-750", "1/6"],
      column_headers: ["Количество пластин"]
    }
  },

  "tech_J27_calcPressureHotSide":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "J27",
      sheet: "технолог",
      color: "FF92D050",
      sample_value: 22,
      row_headers: ["К4-750", "1/6"],
      column_headers: ["Расч Давл по Гор Ст, бар"]
    }
  },

  "tech_K27_calcPressureColdSide":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "K27",
      sheet: "технолог",
      color: "FF92D050",
      sample_value: 22,
      row_headers: ["1/6"],
      column_headers: ["Расч Давл по хол ст, бар"]
    }
  },

  "tech_L27_calcTempHotSide":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "L27",
      sheet: "технолог",
      color: "FF92D050",
      sample_value: 100,
      row_headers: [],
      column_headers: ["Расч Темп по Гор Стороне, С"]
    }
  },

  "tech_M27_calcTempColdSide":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "M27",
      sheet: "технолог",
      color: "FF92D050",
      sample_value: 100,
      row_headers: [],
      column_headers: ["Расч Темп по Хол Стороне, С"]
    }
  },

  "tech_T27_drawDepth":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "T27",
      sheet: "технолог",
      color: "FF92D050",
      sample_value: 5,
      row_headers: ["=P27", "09Г2С", "гофра"],
      column_headers: ["глубина вытяжки, мм"]
    }
  },

  "tech_V27_claddingThickness":
    validation: {
      type: "number",
      required: false,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "V27",
      sheet: "технолог",
      color: "FFFFC000",
      sample_value: 3,
      row_headers: ["гофра"],
      column_headers: ["толщина плакировки, мм"]
    }
  },

  "sup_F2_projectNumber":
    validation: {
      type: "enum",
      required: true,
      values: ["0000", "06ХН28МДТ", "09Г2С", "12Х18Н10Т", "20ХН3А", "30ХМА", "40Х"],
      description: "Auto-detected from material_code pattern"
    },
    context: {
      address: "F2",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: '0000',
      row_headers: [],
      column_headers: []
    }
  },

  "sup_D8_flowPartMaterialPricePerKg":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "D8",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 700,
      row_headers: ["Принятая Цена материала проточной части за кг, руб"],
      column_headers: ["пластина", "=технолог!P27"]
    }
  },

  "sup_E8_flowPartMaterialPrice":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "E8",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 700,
      row_headers: [],
      column_headers: ["плакировка", "=технолог!Q27"]
    }
  },

  "sup_D9_bodyMaterial":
    validation: {
      type: "enum",
      required: false,
      values: ["0000", "06ХН28МДТ", "09Г2С", "12Х18Н10Т", "20ХН3А", "30ХМА", "40Х"],
      description: "Auto-detected from material_code pattern"
    },
    context: {
      address: "D9",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: '09Г2С',
      row_headers: ["Материал корпуса"],
      column_headers: ["пластина", "=технолог!P27"]
    }
  },

  "sup_D10_columnCoverMaterialPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "D10",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Принятая цена материала колонн, крышек, руб за кг"],
      column_headers: ["=технолог!P27", "09Г2С"]
    }
  },

  "sup_D11_panelMaterialPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "D11",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Принятая цена материала панелей, руб за кг"],
      column_headers: ["09Г2С"]
    }
  },

  "sup_K13_normHoursPerUnit":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "K13",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1,
      row_headers: ["количество нормачасов"],
      column_headers: ["=технолог!I27"]
    }
  },

  "sup_P13_internalLogistics":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "P13",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 120000,
      row_headers: ["внутренняя логитика"],
      column_headers: ["=технолог!Q27"]
    }
  },

  "sup_D17_panelCuttingCoefficient":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "D17",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["поправка на раскрой панелей"],
      column_headers: []
    }
  },

  "sup_E19_coverRolledThickness":
    validation: {
      type: "any",
      required: false,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "E19",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: None,
      row_headers: ["МЕТАЛЛ", "толщина проката, м"],
      column_headers: []
    }
  },

  "sup_K19_columnRolledThickness":
    validation: {
      type: "any",
      required: false,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "K19",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: None,
      row_headers: ["МЕТАЛЛ", "толщина проката, м"],
      column_headers: []
    }
  },

  "sup_P19_panelFastenersQuantity":
    validation: {
      type: "number",
      required: false,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "P19",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 88,
      row_headers: ["количество"],
      column_headers: []
    }
  },

  "sup_E20_coverCuttingPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "E20",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["цена раскроя"],
      column_headers: []
    }
  },

  "sup_K20_columnCuttingPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "K20",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["цена раскроя"],
      column_headers: []
    }
  },

  "sup_P20_panelFastenersMaterial":
    validation: {
      type: "enum",
      required: false,
      values: ["0000", "06ХН28МДТ", "09Г2С", "12Х18Н10Т", "20ХН3А", "30ХМА", "40Х"],
      description: "Auto-detected from material_code pattern"
    },
    context: {
      address: "P20",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: '40Х',
      row_headers: ["=M21*K19*K19*M19", "материал"],
      column_headers: []
    }
  },

  "sup_E21_coverProcessingCost":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "E21",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["ОБРАБОТКА 1 шт"],
      column_headers: []
    }
  },

  "sup_K21_columnProcessingCost":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "K21",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["ОБРАБОТКА 1шт"],
      column_headers: []
    }
  },

  "sup_P21_panelFastenersCoating":
    validation: {
      type: "enum",
      required: false,
      values: ["Zn-Cr 9мкм", "ст40Х"],
      description: "Auto-detected from surface_treatment pattern"
    },
    context: {
      address: "P21",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Zn-Cr 9мкм',
      row_headers: ["=(технолог!T27+технолог!U27)*0.001*технолог!I27+2*E19+2*технолог!V27*0.001", "покрытие"],
      column_headers: ["40Х"]
    }
  },

  "sup_P22_panelFastenersStudSize":
    validation: {
      type: "enum",
      required: false,
      values: ["М16", "М18", "М20", "М22", "М24", "М27", "М30", "М33", "М36", "М39", "М42", "М48"],
      description: "Auto-detected from thread_spec pattern"
    },
    context: {
      address: "P22",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'М33',
      row_headers: ["=IF(технолог!G27=снабжение!AM46,M20*D10*(D15+0.03)+K20+K21,M20*D10*D15+K20+K21)", "шпилька"],
      column_headers: ["40Х", "Zn-Cr 9мкм"]
    }
  },

  "sup_Q22_panelFastenersStudCost":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "Q22",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["шпилька", "М33"],
      column_headers: ["цена за 1шт"]
    }
  },

  "sup_Q23_panelFastenersNutCost":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "Q23",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["гайка", "=P22"],
      column_headers: ["цена за 1шт"]
    }
  },

  "sup_Q24_panelFastenersWasherCost":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "Q24",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["шайба", "=P22"],
      column_headers: ["цена за 1шт"]
    }
  },

  "sup_E25_panelRolledThickness":
    validation: {
      type: "any",
      required: false,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "E25",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: None,
      row_headers: ["МЕТАЛЛ на 1шт", "толщина проката, м"],
      column_headers: []
    }
  },

  "sup_K25_panelBRolledThickness":
    validation: {
      type: "any",
      required: false,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "K25",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: None,
      row_headers: ["МЕТАЛЛ на 1 шт", "толщина проката, м"],
      column_headers: []
    }
  },

  "sup_E26_panelCuttingPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "E26",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["цена раскроя"],
      column_headers: []
    }
  },

  "sup_K26_panelBCuttingPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "K26",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["цена раскроя"],
      column_headers: []
    }
  },

  "sup_E27_panelProcessingCost":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "E27",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["ОБРАБОТКА за 1шт"],
      column_headers: []
    }
  },

  "sup_K27_panelBProcessingCost":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "K27",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["ОБРАБОТКА за 1шт"],
      column_headers: []
    }
  },

  "sup_C28_panelAFlange1Pressure":
    validation: {
      type: "enum",
      required: false,
      values: ["Ру10", "Ру100", "Ру16", "Ру160", "Ру25", "Ру40", "Ру6", "Ру63"],
      description: "Auto-detected from pressure_rating pattern"
    },
    context: {
      address: "C28",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Ру10',
      row_headers: ["Фланец №1"],
      column_headers: ["толщина проката, м", "цена раскроя"]
    }
  },

  "sup_D28_panelAFlange1Diameter":
    validation: {
      type: "enum",
      required: false,
      values: ["Ду100", "Ду1000", "Ду125", "Ду150", "Ду200", "Ду25", "Ду250", "Ду300", "Ду32", "Ду350", "Ду40", "Ду400", "Ду450", "Ду50", "Ду600", "Ду65", "Ду80", "Ду800"],
      description: "Auto-detected from diameter_code pattern"
    },
    context: {
      address: "D28",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Ду600',
      row_headers: ["Фланец №1", "Ру10"],
      column_headers: []
    }
  },

  "sup_F28_flange1PanelAPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "F28",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Ру10", "Ду600", "цена 1шт"],
      column_headers: ["плотность", "вес загот, кг", "ширина, м"]
    }
  },

  "sup_I28_panelBFlange3Pressure":
    validation: {
      type: "enum",
      required: false,
      values: ["Ру10", "Ру100", "Ру16", "Ру160", "Ру25", "Ру40", "Ру6", "Ру63"],
      description: "Auto-detected from pressure_rating pattern"
    },
    context: {
      address: "I28",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Ру25',
      row_headers: ["Фланец №3"],
      column_headers: ["толщина проката, м", "цена раскроя"]
    }
  },

  "sup_J28_panelBFlange3Diameter":
    validation: {
      type: "enum",
      required: false,
      values: ["Ду100", "Ду1000", "Ду125", "Ду150", "Ду200", "Ду25", "Ду250", "Ду300", "Ду32", "Ду350", "Ду40", "Ду400", "Ду450", "Ду50", "Ду600", "Ду65", "Ду80", "Ду800"],
      description: "Auto-detected from diameter_code pattern"
    },
    context: {
      address: "J28",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Ду450',
      row_headers: ["Фланец №3", "Ру25"],
      column_headers: []
    }
  },

  "sup_L28_panelBFlange3Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "L28",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Ру25", "Ду450", "цена 1шт"],
      column_headers: ["плотность", "вес загот, кг", "ширина, м"]
    }
  },

  "sup_C29_panelAFlange2Pressure":
    validation: {
      type: "enum",
      required: false,
      values: ["Ру10", "Ру100", "Ру16", "Ру160", "Ру25", "Ру40", "Ру6", "Ру63"],
      description: "Auto-detected from pressure_rating pattern"
    },
    context: {
      address: "C29",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Ру40',
      row_headers: ["Фланец №2"],
      column_headers: ["цена раскроя", "Ру10"]
    }
  },

  "sup_D29_panelAFlange2Diameter":
    validation: {
      type: "enum",
      required: false,
      values: ["Ду100", "Ду1000", "Ду125", "Ду150", "Ду200", "Ду25", "Ду250", "Ду300", "Ду32", "Ду350", "Ду40", "Ду400", "Ду450", "Ду50", "Ду600", "Ду65", "Ду80", "Ду800"],
      description: "Auto-detected from diameter_code pattern"
    },
    context: {
      address: "D29",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Ду600',
      row_headers: ["Фланец №2", "Ру40"],
      column_headers: ["Ду600"]
    }
  },

  "sup_F29_flange2PanelAPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "F29",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Ру40", "Ду600", "цена 1шт"],
      column_headers: ["вес загот, кг", "ширина, м"]
    }
  },

  "sup_I29_panelBFlange4Pressure":
    validation: {
      type: "enum",
      required: false,
      values: ["Ру10", "Ру100", "Ру16", "Ру160", "Ру25", "Ру40", "Ру6", "Ру63"],
      description: "Auto-detected from pressure_rating pattern"
    },
    context: {
      address: "I29",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Ру63',
      row_headers: ["Фланец №4"],
      column_headers: ["цена раскроя", "Ру25"]
    }
  },

  "sup_J29_panelBFlange4Diameter":
    validation: {
      type: "enum",
      required: false,
      values: ["Ду100", "Ду1000", "Ду125", "Ду150", "Ду200", "Ду25", "Ду250", "Ду300", "Ду32", "Ду350", "Ду40", "Ду400", "Ду450", "Ду50", "Ду600", "Ду65", "Ду80", "Ду800"],
      description: "Auto-detected from diameter_code pattern"
    },
    context: {
      address: "J29",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Ду300',
      row_headers: ["Фланец №4", "Ру63"],
      column_headers: ["Ду450"]
    }
  },

  "sup_L29_panelBFlange4Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "L29",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Ру63", "Ду300", "цена 1шт"],
      column_headers: ["вес загот, кг", "ширина, м"]
    }
  },

  "sup_P29_cofFastenersFlange1Size":
    validation: {
      type: "enum",
      required: false,
      values: ["М16", "М18", "М20", "М22", "М24", "М27", "М30", "М33", "М36", "М39", "М42", "М48"],
      description: "Auto-detected from thread_spec pattern"
    },
    context: {
      address: "P29",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'М18',
      row_headers: ["крепёж"],
      column_headers: ["=D28"]
    }
  },

  "sup_Q29_cofFastenersFlange1Material":
    validation: {
      type: "enum",
      required: false,
      values: ["Zn-Cr 9мкм", "ст40Х"],
      description: "Auto-detected from surface_treatment pattern"
    },
    context: {
      address: "Q29",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'ст40Х',
      row_headers: ["крепёж", "М18"],
      column_headers: ["=C28"]
    }
  },

  "sup_R29_cofFastenersFlange1Coating":
    validation: {
      type: "enum",
      required: false,
      values: ["Zn-Cr 9мкм", "ст40Х"],
      description: "Auto-detected from surface_treatment pattern"
    },
    context: {
      address: "R29",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Zn-Cr 9мкм',
      row_headers: ["крепёж", "М18", "ст40Х"],
      column_headers: []
    }
  },

  "sup_T29_cofFastenersFlange1KitPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T29",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["ст40Х", "Zn-Cr 9мкм", "комплект"],
      column_headers: ["=F28"]
    }
  },

  "sup_F30_pipeBilletFlange1Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "F30",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Цена заготовки трубы под фланец №1, 1шт"],
      column_headers: ["ширина, м"]
    }
  },

  "sup_L30_panelBPipeBilletFlange3Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "L30",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Цена заготовки трубы под фланец №3, 1шт"],
      column_headers: ["ширина, м"]
    }
  },

  "sup_T30_cofGasketFlange1Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T30",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["прокладка", "1шт"],
      column_headers: ["=F28"]
    }
  },

  "sup_F31_pipeBilletFlange2Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "F31",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Цена заготовки трубы под фланец №2, 1шт"],
      column_headers: []
    }
  },

  "sup_L31_panelBPipeBilletFlange4Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "L31",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Цена заготовки трубы под фланец №4, 1шт"],
      column_headers: []
    }
  },

  "sup_T31_cofObturatorFlange1Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T31",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["обтюратор"],
      column_headers: ["=F28"]
    }
  },

  "sup_F32_drainageNozzlePrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "F32",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Цена на патрубок (фланец+труба) дренажа, 1шт"],
      column_headers: []
    }
  },

  "sup_L32_panelBDrainageNozzlePrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "L32",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Цена на патрубок (фланец+труба) дренажа, 1шт"],
      column_headers: []
    }
  },

  "sup_F33_ventilationNozzlePrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "F33",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Цена на патрубок(фланец+труба) вентиляции, 1шт"],
      column_headers: []
    }
  },

  "sup_L33_panelBVentilationNozzlePrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "L33",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Цена на патрубок(фланец+труба) вентиляции, 1шт"],
      column_headers: []
    }
  },

  "sup_P33_cofFastenersFlange2Size":
    validation: {
      type: "enum",
      required: false,
      values: ["М16", "М18", "М20", "М22", "М24", "М27", "М30", "М33", "М36", "М39", "М42", "М48"],
      description: "Auto-detected from thread_spec pattern"
    },
    context: {
      address: "P33",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'М18',
      row_headers: ["крепёж"],
      column_headers: ["=D29"]
    }
  },

  "sup_Q33_cofFastenersFlange2Material":
    validation: {
      type: "enum",
      required: false,
      values: ["Zn-Cr 9мкм", "ст40Х"],
      description: "Auto-detected from surface_treatment pattern"
    },
    context: {
      address: "Q33",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'ст40Х',
      row_headers: ["крепёж", "М18"],
      column_headers: ["=C29"]
    }
  },

  "sup_R33_cofFastenersFlange2Coating":
    validation: {
      type: "enum",
      required: false,
      values: ["Zn-Cr 9мкм", "ст40Х"],
      description: "Auto-detected from surface_treatment pattern"
    },
    context: {
      address: "R33",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Zn-Cr 9мкм',
      row_headers: ["крепёж", "М18", "ст40Х"],
      column_headers: ["прокладка"]
    }
  },

  "sup_T33_cofFastenersFlange2KitPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T33",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["ст40Х", "Zn-Cr 9мкм", "комплект"],
      column_headers: ["=F29"]
    }
  },

  "sup_T34_cofGasketFlange2Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T34",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["прокладка", "1шт"],
      column_headers: ["=F29"]
    }
  },

  "sup_T35_cofObturatorFlange2Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T35",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["обтюратор"],
      column_headers: ["=F29"]
    }
  },

  "sup_P37_cofFastenersFlange3Size":
    validation: {
      type: "enum",
      required: false,
      values: ["М16", "М18", "М20", "М22", "М24", "М27", "М30", "М33", "М36", "М39", "М42", "М48"],
      description: "Auto-detected from thread_spec pattern"
    },
    context: {
      address: "P37",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'М18',
      row_headers: ["крепёж"],
      column_headers: ["=J28"]
    }
  },

  "sup_Q37_cofFastenersFlange3Material":
    validation: {
      type: "enum",
      required: false,
      values: ["Zn-Cr 9мкм", "ст40Х"],
      description: "Auto-detected from surface_treatment pattern"
    },
    context: {
      address: "Q37",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'ст40Х',
      row_headers: ["крепёж", "М18"],
      column_headers: ["=I28"]
    }
  },

  "sup_R37_cofFastenersFlange3Coating":
    validation: {
      type: "enum",
      required: false,
      values: ["Zn-Cr 9мкм", "ст40Х"],
      description: "Auto-detected from surface_treatment pattern"
    },
    context: {
      address: "R37",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Zn-Cr 9мкм',
      row_headers: ["крепёж", "М18", "ст40Х"],
      column_headers: ["прокладка"]
    }
  },

  "sup_T37_cofFastenersFlange3KitPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T37",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["ст40Х", "Zn-Cr 9мкм", "комплект"],
      column_headers: ["=L28"]
    }
  },

  "sup_D38_panelGasketsPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "D38",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["Цена 1 шт"],
      column_headers: []
    }
  },

  "sup_I38_eyeboltKitMaterialCost":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "I38",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1000,
      row_headers: ["=D38*4", "металл"],
      column_headers: []
    }
  },

  "sup_K38_supportsKitMaterialCost":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "K38",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1500,
      row_headers: ["металл", "металл"],
      column_headers: []
    }
  },

  "sup_M38_bracesKitMaterialCost":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "M38",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 0,
      row_headers: ["металл", "металл"],
      column_headers: ["=J34*2+L34"]
    }
  },

  "sup_T38_cofGasketFlange3Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T38",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["прокладка", "1шт"],
      column_headers: ["=L28"]
    }
  },

  "sup_F39_spareKitsPressureReserve":
    validation: {
      type: "number",
      required: false,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "F39",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 2,
      row_headers: [],
      column_headers: ["=D38*4"]
    }
  },

  "sup_I39_eyeboltKitProcessingCost":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "I39",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1000,
      row_headers: ["обработка"],
      column_headers: []
    }
  },

  "sup_K39_supportsKitProcessingCost":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "K39",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1200,
      row_headers: ["обработка", "обработка"],
      column_headers: []
    }
  },

  "sup_M39_bracesKitProcessingCost":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "M39",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 0,
      row_headers: ["обработка", "обработка"],
      column_headers: []
    }
  },

  "sup_T39_cofObturatorFlange3Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T39",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["обтюратор"],
      column_headers: ["=L28"]
    }
  },

  "sup_P41_cofFastenersFlange4Size":
    validation: {
      type: "enum",
      required: false,
      values: ["М16", "М18", "М20", "М22", "М24", "М27", "М30", "М33", "М36", "М39", "М42", "М48"],
      description: "Auto-detected from thread_spec pattern"
    },
    context: {
      address: "P41",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'М18',
      row_headers: ["крепёж"],
      column_headers: ["=J29"]
    }
  },

  "sup_Q41_cofFastenersFlange4Material":
    validation: {
      type: "enum",
      required: false,
      values: ["Zn-Cr 9мкм", "ст40Х"],
      description: "Auto-detected from surface_treatment pattern"
    },
    context: {
      address: "Q41",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'ст40Х',
      row_headers: ["крепёж", "М18"],
      column_headers: ["=I29"]
    }
  },

  "sup_R41_cofFastenersFlange4Coating":
    validation: {
      type: "enum",
      required: false,
      values: ["Zn-Cr 9мкм", "ст40Х"],
      description: "Auto-detected from surface_treatment pattern"
    },
    context: {
      address: "R41",
      sheet: "снабжение",
      color: "FFFFC000",
      sample_value: 'Zn-Cr 9мкм',
      row_headers: ["крепёж", "М18", "ст40Х"],
      column_headers: ["прокладка"]
    }
  },

  "sup_T41_cofFastenersFlange4KitPrice":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T41",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["ст40Х", "Zn-Cr 9мкм", "комплект"],
      column_headers: ["=L29"]
    }
  },

  "sup_T42_cofGasketFlange4Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T42",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["прокладка", "1шт"],
      column_headers: ["=L29"]
    }
  },

  "sup_D43_studM24x2000Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "D43",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 3300,
      row_headers: ["цена  шпильки М24х2000, шт"],
      column_headers: []
    }
  },

  "sup_G43_nutM24DIN6330Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "G43",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 600,
      row_headers: ["цена выс. гайки М24 DIN6330, шт"],
      column_headers: []
    }
  },

  "sup_T43_cofObturatorFlange4Price":
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "T43",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: ["обтюратор"],
      column_headers: ["=L29"]
    }
  },

  "sup_D44_studM24x1000Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "D44",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1750,
      row_headers: ["Цена шпильки М24х1000, шт"],
      column_headers: []
    }
  },

  "sup_G44_nutM24DIN933Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "G44",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 87,
      row_headers: ["цена гайки М24 DIN933, шт"],
      column_headers: []
    }
  },

  "sup_I44_otherMaterialsDesc1":
    validation: {
      type: "string",
      required: true,
      description: "Auto-detected from string pattern"
    },
    context: {
      address: "I44",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 'втулка теплоизоляции 90шт',
      row_headers: [],
      column_headers: ["ДРУГИЕ МАТЕРИАЛЫ (не ЗИП), например, теплоизоляция, короб теплоизоляции, втулки для крепления теплоизоляции"]
    }
  },

  "sup_M44_otherMaterialsCost1":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "M44",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 50000,
      row_headers: [],
      column_headers: []
    }
  },

  "sup_D45_studM20x2000Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "D45",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 2800,
      row_headers: ["Цена шпильки М20х2000, шт"],
      column_headers: []
    }
  },

  "sup_G45_nutM20M16DIN933Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "G45",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 50,
      row_headers: ["цена гайки М20/М16 DIN933, шт"],
      column_headers: []
    }
  },

  "sup_I45_otherMaterialsDesc2":
    validation: {
      type: "string",
      required: true,
      description: "Auto-detected from string pattern"
    },
    context: {
      address: "I45",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 'впишите информацию',
      row_headers: [],
      column_headers: ["ДРУГИЕ МАТЕРИАЛЫ (не ЗИП), например, теплоизоляция, короб теплоизоляции, втулки для крепления теплоизоляции", "втулка теплоизоляции 90шт"]
    }
  },

  "sup_M45_otherMaterialsCost2":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "M45",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 0,
      row_headers: [],
      column_headers: []
    }
  },

  "sup_P45_unaccountedCost":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "P45",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 20000,
      row_headers: ["неучтёнка"],
      column_headers: []
    }
  },

  "sup_D46_studM20M16x1000Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "D46",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1200,
      row_headers: ["Цена шпильки М20/М16х1000, шт"],
      column_headers: []
    }
  },

  "снабжение_G46": {
    validation: {
      type: "any",
      required: true,
      description: "Auto-detected from any pattern"
    },
    context: {
      address: "G46",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: None,
      row_headers: [],
      column_headers: []
    }
  },

  "sup_I46_otherMaterialsDesc3":
    validation: {
      type: "string",
      required: true,
      description: "Auto-detected from string pattern"
    },
    context: {
      address: "I46",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 'впишите информацию',
      row_headers: [],
      column_headers: ["втулка теплоизоляции 90шт", "впишите информацию"]
    }
  },

  "sup_M46_otherMaterialsCost3":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "M46",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 0,
      row_headers: [],
      column_headers: []
    }
  },

  "sup_I50_sparePanelStudQuantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "I50",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 10,
      row_headers: ["=P20", "=P21", "=Q22"],
      column_headers: ["количество"]
    }
  },

  "sup_N50_sparePanelGasketsQuantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "N50",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 0,
      row_headers: ["Прокладки панелей", "=D38"],
      column_headers: ["количество"]
    }
  },

  "sup_I51_sparePanelNutQuantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "I51",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 10,
      row_headers: ["=P20", "=P21", "=Q23"],
      column_headers: ["количество"]
    }
  },

  "sup_M51_spareAnchorBoltsCost":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "M51",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 5000,
      row_headers: ["=H51*I51", "крепёж к фундаменту, анкерные болты"],
      column_headers: ["цена за 1шт", "=D38"]
    }
  },

  "sup_N51_spareAnchorBoltsQuantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "N51",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1,
      row_headers: ["крепёж к фундаменту, анкерные болты"],
      column_headers: ["количество"]
    }
  },

  "sup_I52_sparePanelWasherQuantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "I52",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 0,
      row_headers: ["=P20", "=P21", "=Q24"],
      column_headers: ["количество"]
    }
  },

  "sup_M52_spareOtherCost":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "M52",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 7000,
      row_headers: ["=H52*I52", "ДРУГОЕ"],
      column_headers: ["цена за 1шт", "=D38"]
    }
  },

  "sup_N52_spareOtherQuantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "N52",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1,
      row_headers: ["ДРУГОЕ"],
      column_headers: ["количество"]
    }
  },

  "sup_H54_spareFlangeFlange1Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "H54",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 100,
      row_headers: ["=P29", "=Q29", "=R29"],
      column_headers: ["=Q23", "=Q24"]
    }
  },

  "sup_I54_flangeFastenersFlange1Quantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "I54",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 2,
      row_headers: ["=Q29", "=R29"],
      column_headers: ["ИТОГО"]
    }
  },

  "sup_N54_spareFlangeGasketsFlange1Quantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "N54",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1,
      row_headers: ["Фланцевые прокладки", "=T30"],
      column_headers: ["ИТОГО"]
    }
  },

  "sup_H55_spareFlangeFlange2Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "H55",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 100,
      row_headers: ["=P33", "=Q33", "=R33"],
      column_headers: ["=Q24"]
    }
  },

  "sup_I55_flangeFastenersFlange2Quantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "I55",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 2,
      row_headers: ["=Q33", "=R33"],
      column_headers: ["ИТОГО"]
    }
  },

  "sup_N55_spareFlangeGasketsFlange2Quantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "N55",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1,
      row_headers: [],
      column_headers: ["ИТОГО"]
    }
  },

  "sup_H56_spareFlangeFlange3Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "H56",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 200,
      row_headers: ["=P37", "=Q37", "=R37"],
      column_headers: []
    }
  },

  "sup_I56_flangeFastenersFlange3Quantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "I56",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 2,
      row_headers: ["=Q37", "=R37"],
      column_headers: ["ИТОГО"]
    }
  },

  "sup_N56_spareFlangeGasketsFlange3Quantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "N56",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1,
      row_headers: ["=T38"],
      column_headers: ["ИТОГО"]
    }
  },

  "sup_H57_spareFlangeFlange4Price":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "H57",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 150,
      row_headers: ["=P41", "=Q41", "=R41"],
      column_headers: []
    }
  },

  "sup_I57_flangeFastenersFlange4Quantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "I57",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 2,
      row_headers: ["=Q41", "=R41"],
      column_headers: []
    }
  },

  "sup_N57_spareFlangeGasketsFlange4Quantity":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "N57",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 1,
      row_headers: [],
      column_headers: []
    }
  },

  "sup_D78_stainlessSteelThickness":
    validation: {
      type: "number",
      required: true,
      min: 0,
      description: "Auto-detected from number pattern"
    },
    context: {
      address: "D78",
      sheet: "снабжение",
      color: "FF92D050",
      sample_value: 3,
      row_headers: ["=технолог!V27"],
      column_headers: ["Толщина нержавейки"]
    }
  },


};

// Helper functions for validation
export function validateField(fieldKey: string, value: any): { isValid: boolean; error?: string } {
  const rule = VALIDATION_RULES[fieldKey];
  if (!rule) {
    return { isValid: false, error: `Unknown field: ${fieldKey}` };
  }

  const { validation } = rule;
  
  // Required check
  if (validation.required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: 'This field is required' };
  }
  
  // Skip validation for empty optional fields
  if (!validation.required && (value === null || value === undefined || value === '')) {
    return { isValid: true };
  }
  
  // Type-specific validation
  switch (validation.type) {
    case 'number':
      if (typeof value !== 'number' && !(/^-?\d*\.?\d+$/.test(String(value)))) {
        return { isValid: false, error: 'Must be a valid number' };
      }
      const numValue = Number(value);
      if (validation.min !== undefined && numValue < validation.min) {
        return { isValid: false, error: `Must be at least ${validation.min}` };
      }
      if (validation.max !== undefined && numValue > validation.max) {
        return { isValid: false, error: `Must be at most ${validation.max}` };
      }
      break;
      
    case 'string':
      if (typeof value !== 'string') {
        return { isValid: false, error: 'Must be a string' };
      }
      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        return { isValid: false, error: 'Invalid format' };
      }
      break;
      
    case 'enum':
      if (!validation.values?.includes(String(value))) {
        return { isValid: false, error: `Must be one of: ${validation.values?.join(', ')}` };
      }
      break;
      
    case 'any':
      // Any value is valid
      break;
      
    default:
      return { isValid: false, error: 'Unknown validation type' };
  }
  
  return { isValid: true };
}

// Get all field keys by sheet
export function getFieldsBySheet(sheetName: string): string[] {
  return Object.keys(VALIDATION_RULES).filter(key => 
    VALIDATION_RULES[key].context.sheet === sheetName
  );
}

// Get required fields by sheet  
export function getRequiredFields(sheetName: string): string[] {
  return Object.keys(VALIDATION_RULES).filter(key => {
    const rule = VALIDATION_RULES[key];
    return rule.context.sheet === sheetName && rule.validation.required;
  });
}

// Material codes enum for easy access
export const MATERIAL_CODES = ['0000', '06ХН28МДТ', '09Г2С', '12Х18Н10Т', '20ХН3А', '30ХМА', '40Х'] as const;
export const PRESSURE_RATINGS = ['Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160'] as const;
export const DIAMETER_CODES = ['Ду25', 'Ду32', 'Ду40', 'Ду50', 'Ду65', 'Ду80', 'Ду100', 'Ду125', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду500', 'Ду600', 'Ду800', 'Ду1000'] as const;
export const THREAD_SPECS = ['М16', 'М18', 'М20', 'М22', 'М24', 'М27', 'М30', 'М33', 'М36', 'М39', 'М42', 'М48'] as const;
