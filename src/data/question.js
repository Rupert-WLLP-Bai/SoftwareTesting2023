export default [
    {
      id: 1,
      title: "判断三角形问题",
      description: "这个问题涉及如何判断一个三角形的类型。在数学中，一个三角形可以根据其边长或角度分类。此问题要求解决如何确定给定三条边长的三角形类型。根据三角形的性质，可以将其分为等边三角形、等腰三角形、直角三角形、锐角三角形或钝角三角形。解决这个问题的方法可能涉及计算三角形的边长、使用三角函数来计算角度，或者使用一系列的条件语句来根据给定的边长确定三角形的类型。",
      code:`function judge_triangle(a, b, c) {
        let error_msg = "";
        let is_error = false;
      
        if (a < 0) {
          is_error = true;
          error_msg += "a取值不能为负 ";
        }
        if (a === 0) {
          is_error = true;
          error_msg += "a不能为0 ";
        }
        if (a > 100) {
          is_error = true;
          error_msg += "a取值不在范围之内 ";
        }
        if (b < 0) {
          is_error = true;
          error_msg += "b取值不能为负 ";
        }
        if (b === 0) {
          is_error = true;
          error_msg += "b不能为0 ";
        }
        if (b > 100) {
          is_error = true;
          error_msg += "b取值不在范围之内 ";
        }
        if (c < 0) {
          is_error = true;
          error_msg += "c取值不能为负 ";
        }
        if (c === 0) {
          is_error = true;
          error_msg += "c不能为0 ";
        }
        if (c > 100) {
          is_error = true;
          error_msg += "c取值不在范围之内 ";
        }
      
        if (is_error) {
          return error_msg;
        }
      
        if (a + b > c && a + c > b && b + c > a) {
          if (a === b && b === c) {
            return "等边三角形";
          }
          else if (a === b || a === c || b === c) {
            return "等腰三角形";
          }
          else {
            return "非等腰三角形";
          }
        } else {
          return "非三角形";
        }
      }
      `
    },
    {
      id: 2,
      title: "万年历问题",
      description: "这个问题涉及如何计算和显示一个特定年份的万年历。万年历是一种显示特定年份所有月份、日期和星期几的日历。解决这个问题的方法可能涉及确定给定年份的闰年规则，计算每个月份的天数，确定每个月份的起始日和星期几，然后将这些信息整合成一个完整的日历表格。在现代计算机中，可以使用编程语言和日期/时间库来实现万年历功能。解决这个问题的方法可以包括日期计算、条件语句、循环和表格布局等技术",
      code: `function getNextDay(year, month, day) {
        function formatDate(year, month, date) {
            let formattedMonth = month.toString();
            let formattedDate = date.toString();
        
            
        
            return \`\${year}/\${formattedMonth}/\${formattedDate}\`;
        }
        
        
        function isLeapYear(year) {
            if (year % 400 == 0) {
                return true;
            } else if (year % 100 == 0) {
                return false;
            } else if (year % 4 == 0) {
                return true;
            }
        }
        
        let errorMsg = "";
        let isError = false;
        
        if (year < 2000 || year > 2100) {
            isError = true;
            errorMsg += "年份取值范围非法 ";
        }
        
        if (month < 1 || month > 12) {
            isError = true;
            errorMsg += "月份取值范围非法 ";
        }
        
        if (day < 1 || day > 31) {
            isError = true;
            errorMsg += "日期取值范围非法 ";
        }
        
        if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
            isError = true;
            errorMsg += "日期超出该月份对应的范围 ";
        } else if (month == 2) {
            if (isLeapYear(year) == true) {
                if (day == 30 || day == 31) {
                    isError = true;
                    errorMsg += "日期超出该月份对应的范围 ";
                }
            } else {
                if (day == 29 || day == 30 || day == 31) {
                    isError = true;
                    errorMsg += "日期超出该月份对应的范围 ";
                }
            }
        }
        
        if (isError) {
            return errorMsg;
        }
        
        const currentDate = new Date(year, month - 1, day);
        currentDate.setDate(currentDate.getDate() + 1);
        const nextYear = currentDate.getFullYear();
        const nextMonth = currentDate.getMonth() + 1;
        const nextDate = currentDate.getDate();
        
        return formatDate(nextYear, nextMonth, nextDate);
    }
    
    `
    },
    {
        id: 3,
        title: "电脑销售问题",
        description: "这个问题涉及如何设计和实现一个计算机销售员的佣金系统。该系统需要根据销售员每月销售的主机、显示器和外设的数量和价格，计算出销售额和佣金比例，然后输出佣金金额。该系统还需要在输入-1时结束输入并显示总结信息。解决这个问题的方法可能涉及定义变量和常量，获取用户输入，进行数学运算，使用条件语句和循环语句，以及格式化输出。在现代计算机中，可以使用编程语言和标准输入/输出库来实现佣金系统功能。解决这个问题的方法可以包括变量赋值、算术表达式、逻辑表达式、分支结构、循环结构和字符串格式化等技术。",
        code:`// 定义一个函数，输入主机、显示器、外设的销售量，输出奖金，如果输入不合法则返回错误信息
        function getReward(mainMachine, monitor, external) {
          // 先判断-1
          if (mainMachine == -1) {
            return "系统自动统计该销售员本月的销售总额";
          }
          // 定义取值错误信息
          let errorMsg = "";
          let isError = false;
          // 判断取值范围
          if (mainMachine < 1 || mainMachine > 70) {
            isError = true;
            errorMsg += "主机销售量取值范围非法 ";
          }
          if (monitor < 1 || monitor > 80) {
            isError = true;
            errorMsg += "显示器销售量取值范围非法 ";
          }
          if (external < 1 || external > 90) {
            isError = true;
            errorMsg += "外设销售量取值范围非法 ";
          }
          if (isError == true) {
            return errorMsg;
          }
          return String(mainMachine * 25 + monitor * 30 + external * 45);
        }
        `
    },
    {
        id: 4,
        title: "电信收费问题",
        description: "这个问题涉及如何设计和实现一个电信收费问题系统。该系统需要根据用户每月的通话时间、每分钟的通话费、基本月租费、折扣比例和未按时缴费次数，计算出每月的电话总费用。该系统还需要根据通话时间和未按时缴费次数之间的对应关系，判断是否有资格享受折扣。解决这个问题的方法可能涉及定义变量和常量，获取用户输入，进行数学运算，使用条件语句和循环语句，以及格式化输出",
        code:`/**
        * 
        * @param x 通话时长
        * @param y 未缴费时长
        * @returns 返回discount，字符串形式，如"0.02"
        */
       function charge(x, y) {
         let discount = -1;
         if (x <= 0 || x > 43200 || y < 0 || y > 11) {
           return discount.toString();
         } else if (0 < x && x <= 60 && y <= 1) {
           discount = 0.01;
         } else if (60 < x && x <= 120 && y <= 2) {
           discount = 0.015;
         } else if (120 < x && x <= 180 && y <= 3) {
           discount = 0.02;
         } else if (180 < x && x <= 300 && y <= 3) {
           discount = 0.025;
         } else if (x > 300 && y <= 6) {
           discount = 0.03;
         }
         return discount.toString();
       }
       `
        
    },
    {
        id: 5,
        title: "等价类判断三角形问题",
        description: "这个问题涉及如何判断一个三角形的类型并用等价类的方法进行判断。在数学中，一个三角形可以根据其边长或角度分类。此问题要求解决如何确定给定三条边长的三角形类型。根据三角形的性质，可以将其分为等边三角形、等腰三角形、直角三角形、锐角三角形或钝角三角形。解决这个问题的方法可能涉及计算三角形的边长、使用三角函数来计算角度，或者使用一系列的条件语句来根据给定的边长确定三角形的类型。",
        code:`function judge_triangle(a, b, c) {
            let error_msg = "";
            let is_error = false;
          
            if (a < 0) {
              is_error = true;
              error_msg += "a取值不能为负 ";
            }
            if (a === 0) {
              is_error = true;
              error_msg += "a不能为0 ";
            }
            if (a > 100) {
              is_error = true;
              error_msg += "a取值不在范围之内 ";
            }
            if (b < 0) {
              is_error = true;
              error_msg += "b取值不能为负 ";
            }
            if (b === 0) {
              is_error = true;
              error_msg += "b不能为0 ";
            }
            if (b > 100) {
              is_error = true;
              error_msg += "b取值不在范围之内 ";
            }
            if (c < 0) {
              is_error = true;
              error_msg += "c取值不能为负 ";
            }
            if (c === 0) {
              is_error = true;
              error_msg += "c不能为0 ";
            }
            if (c > 100) {
              is_error = true;
              error_msg += "c取值不在范围之内 ";
            }
          
            if (is_error) {
              return error_msg;
            }
          
            if (a + b > c && a + c > b && b + c > a) {
              if (a === b && b === c) {
                return "等边三角形";
              }
              else if (a === b || a === c || b === c) {
                return "等腰三角形";
              }
              else {
                return "非等腰三角形";
              }
            } else {
              return "非三角形";
            }
          }
          `
    },
    {
        id: 6,
        title: "等价类万年历问题",
        description: "这个问题涉及如何计算和显示一个特定年份的万年历并用等价类的方法进行判断。万年历是一种显示特定年份所有月份、日期和星期几的日历。解决这个问题的方法可能涉及确定给定年份的闰年规则，计算每个月份的天数，确定每个月份的起始日和星期几，然后将这些信息整合成一个完整的日历表格。在现代计算机中，可以使用编程语言和日期/时间库来实现万年历功能。解决这个问题的方法可以包括日期计算、条件语句、循环和表格布局等技术",
        code: `function getNextDay(year, month, day) {
            function formatDate(year, month, date) {
                let formattedMonth = month.toString();
                let formattedDate = date.toString();
            
                
            
                return \`\${year}/\${formattedMonth}/\${formattedDate}\`;
            }
            
            
            function isLeapYear(year) {
                if (year % 400 == 0) {
                    return true;
                } else if (year % 100 == 0) {
                    return false;
                } else if (year % 4 == 0) {
                    return true;
                }
            }
            
            let errorMsg = "";
            let isError = false;
            
            if (year < 2000 || year > 2100) {
                isError = true;
                errorMsg += "年份取值范围非法 ";
            }
            
            if (month < 1 || month > 12) {
                isError = true;
                errorMsg += "月份取值范围非法 ";
            }
            
            if (day < 1 || day > 31) {
                isError = true;
                errorMsg += "日期取值范围非法 ";
            }
            
            if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
                isError = true;
                errorMsg += "日期超出该月份对应的范围 ";
            } else if (month == 2) {
                if (isLeapYear(year) == true) {
                    if (day == 30 || day == 31) {
                        isError = true;
                        errorMsg += "日期超出该月份对应的范围 ";
                    }
                } else {
                    if (day == 29 || day == 30 || day == 31) {
                        isError = true;
                        errorMsg += "日期超出该月份对应的范围 ";
                    }
                }
            }
            
            if (isError) {
                return errorMsg;
            }
            
            const currentDate = new Date(year, month - 1, day);
            currentDate.setDate(currentDate.getDate() + 1);
            const nextYear = currentDate.getFullYear();
            const nextMonth = currentDate.getMonth() + 1;
            const nextDate = currentDate.getDate();
            
            return formatDate(nextYear, nextMonth, nextDate);
        }
        
        `
    },
    {
        id: 7,
        title: "决策表万年历问题",
        description: "这个问题涉及如何计算和显示一个特定年份的万年历并用决策表的方法进行判断。万年历是一种显示特定年份所有月份、日期和星期几的日历。解决这个问题的方法可能涉及确定给定年份的闰年规则，计算每个月份的天数，确定每个月份的起始日和星期几，然后将这些信息整合成一个完整的日历表格。在现代计算机中，可以使用编程语言和日期/时间库来实现万年历功能。解决这个问题的方法可以包括日期计算、条件语句、循环和表格布局等技术",
        code: `function getNextDay(year, month, day) {
            function formatDate(year, month, date) {
                let formattedMonth = month.toString();
                let formattedDate = date.toString();
            
                
            
                return \`\${year}/\${formattedMonth}/\${formattedDate}\`;
            }
            
            
            function isLeapYear(year) {
                if (year % 400 == 0) {
                    return true;
                } else if (year % 100 == 0) {
                    return false;
                } else if (year % 4 == 0) {
                    return true;
                }
            }
            
            let errorMsg = "";
            let isError = false;
            
            if (year < 2000 || year > 2100) {
                isError = true;
                errorMsg += "年份取值范围非法 ";
            }
            
            if (month < 1 || month > 12) {
                isError = true;
                errorMsg += "月份取值范围非法 ";
            }
            
            if (day < 1 || day > 31) {
                isError = true;
                errorMsg += "日期取值范围非法 ";
            }
            
            if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
                isError = true;
                errorMsg += "日期超出该月份对应的范围 ";
            } else if (month == 2) {
                if (isLeapYear(year) == true) {
                    if (day == 30 || day == 31) {
                        isError = true;
                        errorMsg += "日期超出该月份对应的范围 ";
                    }
                } else {
                    if (day == 29 || day == 30 || day == 31) {
                        isError = true;
                        errorMsg += "日期超出该月份对应的范围 ";
                    }
                }
            }
            
            if (isError) {
                return errorMsg;
            }
            
            const currentDate = new Date(year, month - 1, day);
            currentDate.setDate(currentDate.getDate() + 1);
            const nextYear = currentDate.getFullYear();
            const nextMonth = currentDate.getMonth() + 1;
            const nextDate = currentDate.getDate();
            
            return formatDate(nextYear, nextMonth, nextDate);
        }
        
        `
    },
    {
        id: 8,
        title: "ATM机问题",
        description: "这个问题涉及如何使用状态转换测试方法来测试一个ATM系统。该方法需要根据ATM系统的状态图，分析出系统的所有可能的状态和转换，然后构建出一个转换树，表示系统从初始状态到终止状态的所有可能的路径。最后，根据转换树，设计出逻辑测试用例，覆盖系统的所有状态和转换。解决这个问题的方法可能涉及理解状态图的概念和符号，识别系统的状态和转换，绘制转换树，编写测试用例。在现代计算机中，可以使用绘图软件和文本编辑器来实现状态转换测试方法功能。解决这个问题的方法可以包括状态图分析、转换树构建、测试用例设计等技术",
    },
    {
        id: 9,
        title: "显示汉字控制流图",
        description: "这是一个用c语言编写的程序，它的功能是从一个文件中读取汉字的点阵数据，并在屏幕上显示出来。它接受四个参数，分别是汉字显示的起始坐标x和y，汉字之间的间距Wid，以及汉字字符串Str。它首先检查字符串是否为空，然后对每个汉字进行处理。它根据汉字的两个字节计算出它在文件中的位置，然后读取72个字节的点阵数据到一个缓冲区中。它再使用三重循环遍历缓冲区中的每个像素点，如果像素点为1，则根据y坐标和点阵数据计算出颜色，并在屏幕上画出来。如果像素点为0，则忽略。它最后更新x坐标，并继续处理下一个汉字，直到字符串结束或遇到非法字符为止",
    },
    {
        id: 10,
        title: "销售系统佣金白盒问题",
        description: "这是一个用于计算销售员佣金的系统，它根据销售员的年销售额、请假天数和现金到帐比例，按照不同的规则，计算出佣金系数和佣金值。为了测试这个系统的正确性，需要使用白盒测试方法。该方法需要根据系统的需求，设计出一个流程图，表示系统的逻辑结构和控制流程。然后根据不同的覆盖标准，设计出测试用例，覆盖系统的所有语句、判断、条件和组合。最后，根据测试用例，执行测试，并检查结果是否符合预期。解决这个问题的方法可能涉及理解流程图的概念和符号，识别系统的输入、输出、变量、常量、分支和循环，绘制流程图，编写测试用例，执行测试。",
        code:`function calculateCommission(sales, days_off, cash_ratio) {
            let commission;
            
            if (sales > 2000000 && days_off <= 10) {
              if (cash_ratio >= 0.6) {
                let commission_rate = 7;
                commission = sales / commission_rate;
              } else {
                commission = 0;
              }
            } else {
              let commission_rate;
              
              if (cash_ratio <= 0.85) {
                commission_rate = 6;
              } else {
                commission_rate = 5;
              }
              
              commission = sales / commission_rate;
            }
            
            return commission.toString();
          }
          `
    },
  ];
