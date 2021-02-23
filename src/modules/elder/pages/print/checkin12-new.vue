<template>
  <div>
    <!-- 上海市养老服务需求评估表 -->
    <div class="page">
      <h2 class="title">上海市养老服务需求评估表</h2>

      <div class="info">
        <p class="a">
          <span>服务申请人姓名</span>:<i>{{ careAssessTable.elderName }}</i>
        </p>
        <p class="b"><span>区县/街镇</span>:<i>{{ careAssessTable.residenceCity }}{{ careAssessTable.residenceDistrict }}{{ careAssessTable.residenceStreet }}{{ careAssessTable.residenceAddress }}</i></p>
        <p class="e"><span>评估表编号</span>:<i></i></p>
        <p class="c">
          <span>评估类别</span>:<i>{{
            careAssessTable.estimateType | typeFilter
          }}</i>
        </p>
        <p class="f">
          <span>评估次数</span>:<i>第{{ careAssessTable.estimateCount }}次</i>
        </p>
        <p class="d"><span>上次评估日期</span>:
          <i v-if="careAssessTable.lastTime">
            {{ $moment(careAssessTable.lastTime).format('YYYY年MM月DD日')}}
          </i>
          <i v-else class="space">年月日</i>
        </p>
        <p class="d"><span>本次评估日期</span>:
          <i v-if="careAssessTable.createTime">
            {{ $moment(careAssessTable.createTime).format('YYYY年MM月DD日')}}
          </i>
          <i class="space" v-else>年月日</i>
        </p>
        <p class="e">
          <span>评估员姓名</span>:<i>{{ careAssessTable.creator }}</i>
        </p>
      </div>
    </div>

    <!-- 《服务申请表资料》 -->
    <div class="page">
      <p style="text-align: center;">摘录</p>
      <h2 class="tit" style="margin: 0">《服务申请表资料》</h2>
      <div class="server">
        <h3>一、个人资料</h3>
        <table cellspacing="0" cellpadding="0" border="1">
          <tr>
            <td width="18%">姓名</td>
            <td width="24%">{{ careAssessTable.elderName }}</td>
            <td width="18%">身份证号码</td>
            <td width="40%">{{ careAssessTable.cardNo }}</td>
          </tr>
          <tr>
            <td>性别</td>
            <td>{{ careAssessTable.gender }}</td>
            <td>社保卡号</td>
            <td>{{ careAssessTable.insuranceNo }}</td>
          </tr>
          <tr>
            <td>民族</td>
            <td>{{ careAssessTable.nation }}</td>
            <td>文化程度</td>
            <td class="inputcon">
              <p>
                <input
                  type="checkbox"
                  :checked="careAssessTable.educational === '小学及以下'"
                />小学及以下
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="careAssessTable.educational === '初中'"
                />初中
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="careAssessTable.educational === '高中'"
                />高中
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="careAssessTable.educational === '大专'"
                />大专
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="careAssessTable.educational === '本科'"
                />本科
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="careAssessTable.educational === '研究生及以上'"
                />研究生及以上
              </p>
            </td>
          </tr>
          <tr>
            <td>出生年月</td>
            <td>{{ careAssessTable.birthDay | dateFormat }}</td>
            <td>曾从事职业</td>
            <td></td>
          </tr>
          <tr>
            <td>籍贯</td>
            <td>{{ careAssessTable.birthPlace }}</td>
            <td>婚姻状况</td>
            <td class="inputcon">
              <p>
                <input
                  type="checkbox"
                  :checked="careAssessTable.marriage === '已婚'"
                />已婚
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="careAssessTable.marriage === '未婚'"
                />未婚
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="careAssessTable.marriage === '丧偶'"
                />丧偶
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="careAssessTable.marriage === '离异'"
                />离异
              </p>
            </td>
          </tr>
          <tr>
            <td>户籍所在地</td>
            <td colspan="3" class="address">
              {{ careAssessTable.registerProvince
              }}{{ careAssessTable.registerCity }}
              {{ careAssessTable.registerDistrict
              }}{{ careAssessTable.registerStreet }}
              {{ careAssessTable.registerAddress }}
            </td>
          </tr>

          <tr>
            <td>居住地址</td>
            <td colspan="3" class="address">
              {{ careAssessTable.residenceProvince
              }}{{ careAssessTable.residenceCity }}
              {{ careAssessTable.residenceDistrict
              }}{{ careAssessTable.residenceStreet }}
              {{ careAssessTable.residenceAddress }}
            </td>
          </tr>
          <tr>
            <td rowspan="2">邮编</td>
            <td rowspan="2"></td>
            <td>住宅电话</td>
            <td>{{ careAssessTable.homePhone }}</td>
          </tr>
          <tr>
            <td>移动电话</td>
            <td>{{ careAssessTable.mobilePhone }}</td>
          </tr>

          <tr>
            <td>代理人姓名</td>
            <td>{{ careAssessTable.relationName }}</td>
            <td>与申请人关系</td>
            <td>{{ careAssessTable.relationType }}</td>
          </tr>
          <tr>
            <td>代理人地址</td>
            <td colspan="3" class="address">
              {{ careAssessTable.relationResidenceAddress }}
            </td>
          </tr>
          <tr>
            <td rowspan="2">邮编</td>
            <td rowspan="2"></td>
            <td>住宅电话</td>
            <td></td>
          </tr>
          <tr>
            <td>移动电话</td>
            <td>{{ careAssessTable.relationMobilePhone }}</td>
          </tr>
        </table>

        <h3>二、目前生活状况</h3>
        <table cellspacing="0" cellpadding="0" border="1">
          <tr>
            <td width="20%">经济状况</td>
            <td width="80%" class="inputcon">
              <p><input type="checkbox" />退休金</p>
              <p><input type="checkbox" />子女补贴</p>
              <p><input type="checkbox" />亲友资助</p>
              <p><input type="checkbox" />其它补贴</p>
            </td>
          </tr>
          <tr>
            <td>居住状况</td>
            <td class="inputcon inputcon1">
              <p>
                <input
                  type="checkbox"
                  :checked="
                    projectSociety[0].itemName === '与子女或亲戚朋友同住'
                  "
                />与子女或亲戚朋友同住。
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="projectSociety[0].itemName === '与配偶同住'"
                />与配偶同住。
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="projectSociety[0].itemName === '独自居住'"
                />独自居住。
              </p>
              <p>
                <input
                  type="checkbox"
                  :checked="projectSociety[0].itemName === '入住养老机构'"
                />入住养老机构。
              </p>
            </td>
          </tr>
          <tr>
            <td>住房性质</td>
            <td class="inputcon">
              <p><input type="checkbox" />产权房</p>
              <p><input type="checkbox" />租赁房</p>
              <p><input type="checkbox" />廉租房</p>
              <p><input type="checkbox" />私房</p>
            </td>
          </tr>
          <tr>
            <td>帮助照料</td>
            <td class="inputcon inputco2">
              您有需要帮助时（包括患病时）是否得到照料：<br />
              <p><input type="checkbox" />是</p>
              <p><input type="checkbox" />否</p>
              <br />如是，谁帮助照料：<br />
              <p><input type="checkbox" />子女</p>
              <p><input type="checkbox" />配偶</p>
              <p><input type="checkbox" />亲友</p>
              <p style="width:200px;"><input type="checkbox" />其它：<i></i></p>
            </td>
          </tr>
          <tr>
            <td>就医方式</td>
            <td class="inputcon inputco2">
              <p><input type="checkbox" />家庭病房</p>
              <p><input type="checkbox" />社区医生</p>
              <br />
              <p><input type="checkbox" />外出就诊</p>
              <p style="width:300px;">
                习惯就诊的医院：
              </p>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- 目录 -->
    <div class="page">
      <h2 class="tit">目录</h2>
      <div class="dic">
        <h4>评估表参数项目</h4>
        <p>一、生活自理能力 (主要参数)<i>1</i></p>
        <p>二、认知能力 (主要参数)<i>2</i></p>
        <p>三、情绪行为 (主要参数)<i>3</i></p>
        <p>四、视觉能力 (主要参数)<i>4</i></p>
        <p>五、社会生活环境 (背景参数)<i>5</i></p>
        <h4>评估报告</h4>
        <p>一、评估总分计算<i>8</i></p>
        <p>
          二、评估员总结<i>9</i> <br />
          <span style="margin: 0 0 0 20px;">1. 生活自理能力</span> <br />
          <span style="margin: 0 0 0 20px;">2. 认知能力</span> <br />
          <span style="margin: 0 0 0 20px;">3. 情绪行为</span> <br />
          <span style="margin: 0 0 0 20px;">4. 视觉能力</span> <br />
          <span style="margin: 0 0 0 20px;">5. 社会生活环境</span>
        </p>
        <p>三、养老服务建议<i>11</i></p>
        <p>四、确认评估报告<i>12</i></p>
      </div>
    </div>

    <!-- 参数项目一：生活自理能力 -->
    <div class="page">
      <table
        class="table12 table121"
        cellspacing="0"
        cellpadding="0"
        border="1"
      >
        <tr>
          <th colspan="8">《评估表参数项目》</th>
        </tr>

        <tr>
          <td colspan="8" style="font-size:9pt;">
            参数项目一：生活自理能力（主要参数）
          </td>
        </tr>

        <tr>
          <td colspan="2" rowspan="2">评估事项</td>
          <td colspan="4">程度等级</td>
          <td colspan="2" rowspan="2">判断评分</td>
        </tr>
        <tr>
          <td>正常</td>
          <td>轻度依赖</td>
          <td>中度依赖</td>
          <td>重度依赖</td>
        </tr>

        <tr>
          <td width="3%" class="cen">(1)进食</td>
          <td width="13%">使用餐具将饭菜送入口、咀嚼、吞咽等步骤。</td>

          <td width="11%">独立完成。</td>
          <td width="16%">-</td>
          <td width="16%">需要协助，如切碎、搅拌食物等。</td>
          <td width="16%">完全需要帮助。</td>

          <td width="13%" class="right">
            正常<br />-<br />中度依赖<br />重度依赖
          </td>
          <td width="12%" class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectLife[0].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              -
            </p>
            <p>
              3分<input
                type="checkbox"
                :checked="
                  projectLife[0].itemName == '中度依赖' ? 'checked' : ''
                "
              />
            </p>
            <p>
              5分<input
                type="checkbox"
                :checked="
                  projectLife[0].itemName == '重度依赖' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>

        <tr>
          <td class="cen">(2)个人卫生</td>
          <td>修饰、洗澡等。</td>
          <td>独立完成。</td>
          <td>能独立地洗头、梳头、洗脸、刷牙、剃须等，洗澡需要协助。</td>
          <td>在协助下和适当的时间内，能完成部分修饰；洗澡需要帮助。</td>
          <td>完全需要帮助。</td>
          <td class="right">正常<br />轻度依赖<br />中度依赖<br />重度依赖</td>
          <td class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectLife[1].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              1分<input
                type="checkbox"
                :checked="
                  projectLife[1].itemName == '轻度依赖' ? 'checked' : ''
                "
              />
            </p>
            <p>
              3分<input
                type="checkbox"
                :checked="
                  projectLife[1].itemName == '中度依赖' ? 'checked' : ''
                "
              />
            </p>
            <p>
              7分<input
                type="checkbox"
                :checked="
                  projectLife[1].itemName == '重度依赖' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>

        <tr>
          <td class="cen">(3)穿衣</td>
          <td>穿上衣、穿下衣等。</td>
          <td>独立完成。</td>
          <td>-</td>
          <td>需要协助，在适当的时间内完成部分穿衣。</td>
          <td>完全需要帮助。</td>
          <td class="right">正常<br />-<br />中度依赖<br />重度依赖</td>
          <td class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectLife[2].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              -
            </p>
            <p>
              3分<input
                type="checkbox"
                :checked="
                  projectLife[2].itemName == '中度依赖' ? 'checked' : ''
                "
              />
            </p>
            <p>
              5分<input
                type="checkbox"
                :checked="
                  projectLife[2].itemName == '重度依赖' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>

        <tr>
          <td class="cen">(4)如厕及排泄</td>
          <td>如厕、小便、大便等。</td>
          <td>不需协助。</td>
          <td>偶尔失禁，但基本上能如厕或使用便盆</td>
          <td>经常失禁，在很多提示和协助下尚能如厕或使用便盆。</td>
          <td>完全失禁，完全需要帮助。</td>
          <td class="right">正常<br />轻度依赖<br />中度依赖<br />重度依赖</td>
          <td class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectLife[3].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              1分<input
                type="checkbox"
                :checked="
                  projectLife[3].itemName == '轻度依赖' ? 'checked' : ''
                "
              />
            </p>
            <p>
              5分<input
                type="checkbox"
                :checked="
                  projectLife[3].itemName == '中度依赖' ? 'checked' : ''
                "
              />
            </p>
            <p>
              10分<input
                type="checkbox"
                :checked="
                  projectLife[3].itemName == '重度依赖' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>

        <tr>
          <td class="cen">(5)移动</td>
          <td>站立、转移、行走、上下楼梯等。</td>
          <td>独立完成。</td>
          <td>借助较小的外力或辅助装置能完成站立、转移、行走、上下楼梯等。</td>
          <td>借助较大的外力才能完成站立、转移、行走，不能上下楼梯。</td>
          <td>卧床不起，移动完全需要帮助。</td>
          <td class="right">正常<br />轻度依赖<br />中度依赖<br />重度依赖</td>
          <td class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectLife[4].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              1分<input
                type="checkbox"
                :checked="
                  projectLife[4].itemName == '轻度依赖' ? 'checked' : ''
                "
              />
            </p>
            <p>
              5分<input
                type="checkbox"
                :checked="
                  projectLife[4].itemName == '中度依赖' ? 'checked' : ''
                "
              />
            </p>
            <p>
              10分<input
                type="checkbox"
                :checked="
                  projectLife[4].itemName == '重度依赖' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>
        <!-- <tr>
          <td colspan="4">判断评分参考值:</td><td colspan="4">参考项目-评估结论:</td>
        </tr>
        <tr>
          <td colspan="4">0-1分  生活自理能力正常</td><td colspan="4">1.评分总和</td>
        </tr> -->
      </table>
    </div>

    <!-- 参数项目一评估结论 -->
    <div class="page">
      <table class="table122" cellspacing="0" cellpadding="0" border="1">
        <tr>
          <td colspan="4">判断评分参考值：</td>
          <td colspan="4">参数项目一 - 评估结论：</td>
        </tr>
        <tr>
          <td colspan="4" rowspan="3">
            <span>0 - 3分</span> <i>生活自理能力正常</i><br />
            <span>4 - 9分</span> <i>生活自理能力轻度依赖</i><br />
            <span>10 - 18分</span> <i>生活自理能力中度依赖</i><br />
            <span>19分或以上</span> <i>生活自理能力重度依赖</i>
          </td>
          <td>1.评分总和</td>
          <td colspan="3">{{ projectLife[5].itemValue }}</td>
        </tr>
        <tr>
          <td>2.判断等级</td>
          <td colspan="3" class="pingfen">
            <p>
              正常<input
                type="checkbox"
                :checked="projectLife[5].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              轻度依赖<input
                type="checkbox"
                :checked="projectLife[5].itemName == '轻度' ? 'checked' : ''"
              />
            </p>
            <p>
              中度依赖<input
                type="checkbox"
                :checked="projectLife[5].itemName == '中度' ? 'checked' : ''"
              />
            </p>
            <p>
              重度依赖<input
                type="checkbox"
                :checked="projectLife[5].itemName == '重度' ? 'checked' : ''"
              />
            </p>
          </td>
        </tr>
        <tr>
          <td>3.结论备注</td>
          <td colspan="3">{{ projectLife[6].remark }}</td>
        </tr>
      </table>
    </div>

    <!-- 参数项目二：认知能力 -->
    <div class="page">
      <table
        class="table12 table123"
        cellspacing="0"
        cellpadding="0"
        border="1"
      >
        <tr>
          <th colspan="8">《评估表参数项目》</th>
        </tr>

        <tr>
          <td colspan="8">参数项目二：认知能力（主要参数）</td>
        </tr>

        <tr>
          <td colspan="2" rowspan="2">评估事项</td>
          <td colspan="4">程度等级</td>
          <td colspan="2" rowspan="2">判断评分</td>
        </tr>
        <tr>
          <td>正常</td>
          <td>轻度依赖</td>
          <td>中度依赖</td>
          <td>重度依赖</td>
        </tr>

        <tr>
          <td width="3%">(1)近期记忆</td>
          <td width="17%">回想近期发生的事情。</td>
          <td width="14%">对近期发生的事情记忆清晰。</td>
          <td width="14%">对近期发生的事情记忆模糊。</td>
          <td width="15%">对近期发生的事情遗忘，在提示下能记起部分。</td>
          <td width="15%">经提示也不能记起对近期发生的事情。</td>

          <td width="12%" class="right">
            正常<br />轻度缺失<br />中度缺失<br />重度缺失
          </td>
          <td width="10%" class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectKnow[0].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              2分<input
                type="checkbox"
                :checked="
                  projectKnow[0].itemName == '轻度缺失' ? 'checked' : ''
                "
              />
            </p>
            <p>
              5分<input
                type="checkbox"
                :checked="
                  projectKnow[0].itemName == '中度缺失' ? 'checked' : ''
                "
              />
            </p>
            <p>
              10分<input
                type="checkbox"
                :checked="
                  projectKnow[0].itemName == '重度缺失' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>

        <tr>
          <td>(2)程序记忆</td>
          <td>完成习得的生活技能，如穿衣程序、烧水泡茶程序等。</td>
          <td>正确完成。</td>
          <td>-</td>
          <td>在提示下能正确完成。</td>
          <td>经提示也不能正确完成。</td>
          <td class="right">正常<br />-<br />中度缺失<br />重度缺失</td>
          <td class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectKnow[1].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>-</p>
            <p>
              5分<input
                type="checkbox"
                :checked="
                  projectKnow[1].itemName == '中度缺失' ? 'checked' : ''
                "
              />
            </p>
            <p>
              10分<input
                type="checkbox"
                :checked="
                  projectKnow[1].itemName == '重度缺失' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>

        <tr>
          <td>(3)定向能力</td>
          <td>现实导向能力，对人物、地点、时间、空间等的识别和判断能力。</td>
          <td>定向力正常。</td>
          <td>-</td>
          <td>在提示下，能正确说出人物、地点、时间、空间等。</td>
          <td>经提示也不能正确说出人物、地点、时间、空间等。</td>
          <td class="right">正常<br />-<br />中度缺失<br />重度缺失</td>
          <td class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectKnow[2].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>-</p>
            <p>
              5分<input
                type="checkbox"
                :checked="
                  projectKnow[2].itemName == '中度缺失' ? 'checked' : ''
                "
              />
            </p>
            <p>
              10分<input
                type="checkbox"
                :checked="
                  projectKnow[2].itemName == '重度缺失' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>

        <tr>
          <td>(4)判断能力</td>
          <td>对日常生活的内容、时间、谁人处理等作出判断。</td>
          <td>能正确作出判断。</td>
          <td>-</td>
          <td>在提示下能作出判断，表现为判断迟缓、不决。</td>
          <td>判断错误。</td>
          <td class="right">正常<br />-<br />中度缺失<br />重度缺失</td>
          <td class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectKnow[3].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>-</p>
            <p>
              5分<input
                type="checkbox"
                :checked="
                  projectKnow[3].itemName == '中度缺失' ? 'checked' : ''
                "
              />
            </p>
            <p>
              10分<input
                type="checkbox"
                :checked="
                  projectKnow[3].itemName == '重度缺失' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>
        <tr>
          <td colspan="4">判断评分参考值：</td>
          <td colspan="4">参数项目二 - 评估结论：</td>
        </tr>
        <tr>
          <td colspan="4" rowspan="3">
            <span>0 - 4分</span> <i>认知能力正常</i><br />
            <span>5 - 14分</span> <i>认知能力轻度缺失</i><br />
            <span>15 - 29分</span> <i>认知能力中度缺失</i><br />
            <span>30分或以上</span> <i>认知能力重度缺失</i>
          </td>
          <td>1.评分总和</td>
          <td colspan="3">{{ projectKnow[4].itemValue }}</td>
        </tr>
        <tr>
          <td>2.判断等级</td>
          <td colspan="3" class="pingfen pingfenpadd">
            <p>
              正常<input
                type="checkbox"
                :checked="projectKnow[4].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              轻度缺失<input
                type="checkbox"
                :checked="projectKnow[4].itemName == '轻度' ? 'checked' : ''"
              />
            </p>
            <p>
              中度缺失<input
                type="checkbox"
                :checked="projectKnow[4].itemName == '中度' ? 'checked' : ''"
              />
            </p>
            <p>
              重度缺失<input
                type="checkbox"
                :checked="projectKnow[4].itemName == '重度' ? 'checked' : ''"
              />
            </p>
          </td>
        </tr>
        <tr>
          <td>3.结论备注</td>
          <td colspan="3">{{ projectKnow[5].remark }}</td>
        </tr>
      </table>
    </div>

    <!-- 参数项目三：情绪行为 -->
    <div class="page">
      <table
        class="table12 table124"
        cellspacing="0"
        cellpadding="0"
        border="1"
      >
        <tr>
          <th colspan="8">《评估表参数项目》</th>
        </tr>

        <tr>
          <td colspan="8">参数项目三：情绪行为（主要参数）</td>
        </tr>

        <tr>
          <td colspan="2" rowspan="2">评估事项</td>
          <td colspan="4">程度等级</td>
          <td colspan="2" rowspan="2">判断评分</td>
        </tr>
        <tr>
          <td>正常</td>
          <td>轻度异常</td>
          <td>中度异常</td>
          <td>重度异常</td>
        </tr>

        <tr>
          <td width="3%">(1)情绪</td>
          <td width="17%">
            对客观事物的主观态度体验是否与实际相符，能否被常人理解。
          </td>
          <td width="14%">情绪稳定。</td>
          <td width="14%">情绪欠稳定，但尚能被人理解；</td>
          <td width="14%">无诱因，情绪变化较大。</td>
          <td width="14%">喜怒无常或毫无反应。</td>

          <td width="14%" class="right">
            正常<br />轻度异常<br />中度异常<br />重度异常
          </td>
          <td width="10%" class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectEmotion[0].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              2分<input
                type="checkbox"
                :checked="
                  projectEmotion[0].itemName == '轻度异常' ? 'checked' : ''
                "
              />
            </p>
            <p>
              6分<input
                type="checkbox"
                :checked="
                  projectEmotion[0].itemName == '中度异常' ? 'checked' : ''
                "
              />
            </p>
            <p>
              10分<input
                type="checkbox"
                :checked="
                  projectEmotion[0].itemName == '重度异常' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>

        <tr>
          <td>(2)行为</td>
          <td>动作行为表现有否异常。</td>
          <td>行为正常。</td>
          <td>偶尔有异常行为，但不影响正常生活，不需要协助调适或监护。</td>
          <td>经常有异常行为，影响正常生活，需要一定监护。</td>
          <td>经常有异常行为，严重影响正常生活，完全需要监护。</td>
          <td class="right">正常<br />轻度异常<br />中度异常<br />重度异常</td>
          <td class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectEmotion[1].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              2分<input
                type="checkbox"
                :checked="
                  projectEmotion[1].itemName == '轻度异常' ? 'checked' : ''
                "
              />
            </p>
            <p>
              6分<input
                type="checkbox"
                :checked="
                  projectEmotion[1].itemName == '中度异常' ? 'checked' : ''
                "
              />
            </p>
            <p>
              10分<input
                type="checkbox"
                :checked="
                  projectEmotion[1].itemName == '重度异常' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>

        <tr>
          <td>(3)沟通能力</td>
          <td>在交流中能否互相理解。</td>
          <td>理解准确，表达清晰。</td>
          <td>-</td>
          <td>需提示才能听懂、简单表达。</td>
          <td>交流困难，不能表达和理解。</td>
          <td class="right">正常<br />-<br />中度异常<br />重度异常</td>
          <td class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectEmotion[2].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>-</p>
            <p>
              1分<input
                type="checkbox"
                :checked="
                  projectEmotion[2].itemName == '中度异常' ? 'checked' : ''
                "
              />
            </p>
            <p>
              2分<input
                type="checkbox"
                :checked="
                  projectEmotion[2].itemName == '重度异常' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>
        <tr>
          <td colspan="4">判断评分参考值：</td>
          <td colspan="4">参数项目三 - 评估结论：</td>
        </tr>
        <tr>
          <td colspan="4" rowspan="3">
            <span>0 - 1分</span> <i>情绪行为正常</i><br />
            <span>2 - 5分</span> <i>情绪行为轻度异常</i><br />
            <span>6 - 14分</span> <i>情绪行为中度异常</i><br />
            <span>15分或以上</span> <i>情绪行为重度异常</i>
          </td>
          <td>1.评分总和</td>
          <td colspan="3">{{ projectEmotion[3].itemValue }}</td>
        </tr>
        <tr>
          <td>2.判断等级</td>
          <td colspan="3" class="pingfen pingfenpadd">
            <p>
              正常<input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>
              轻度异常<input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '轻度' ? 'checked' : ''"
              />
            </p>
            <p>
              中度异常<input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '中度' ? 'checked' : ''"
              />
            </p>
            <p>
              重度异常<input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '重度' ? 'checked' : ''"
              />
            </p>
          </td>
        </tr>
        <tr>
          <td>3.结论备注</td>
          <td colspan="3">{{ projectEmotion[4].remark }}</td>
        </tr>
      </table>
    </div>

    <!-- 参数项目四：视觉能力 -->
    <div class="page">
      <table
        class="table12 table125"
        cellspacing="0"
        cellpadding="0"
        border="1"
      >
        <tr>
          <th colspan="8">《评估表参数项目》</th>
        </tr>

        <tr>
          <td colspan="8">参数项目四：视觉能力（主要参数）</td>
        </tr>

        <tr>
          <td colspan="2" rowspan="2">评估事项</td>
          <td colspan="4">程度等级</td>
          <td colspan="2" rowspan="2">判断评分</td>
        </tr>
        <tr>
          <td>正常</td>
          <td>轻度障碍</td>
          <td>中度障碍</td>
          <td>重度障碍</td>
        </tr>

        <tr>
          <td width="3%">(1)视力</td>
          <td width="17%">有否视力障碍，能否安全照顾自己。</td>

          <td width="14%">在正常环境下能安全照顾自己。</td>
          <td width="14%">-</td>
          <td width="14%">低视力（矫正后），生活需要照顾。</td>
          <td width="14%">
            由于视力障碍，功能完全丧失，无法适应生活环境而安全照顾自己。
          </td>

          <td width="14%" class="right">
            正常<br />-<br />中度障碍<br />重度障碍
          </td>
          <td width="10%" class="pingfen">
            <p>
              0分<input
                type="checkbox"
                :checked="projectVision[0].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>-</p>
            <p>
              5分<input
                type="checkbox"
                :checked="
                  projectVision[0].itemName == '中度障碍' ? 'checked' : ''
                "
              />
            </p>
            <p>
              10分<input
                type="checkbox"
                :checked="
                  projectVision[0].itemName == '重度障碍' ? 'checked' : ''
                "
              />
            </p>
          </td>
        </tr>

        <tr>
          <td colspan="4">判断评分参考值：</td>
          <td colspan="4">参数项目四评估结论：</td>
        </tr>
        <tr>
          <td colspan="4" rowspan="3">
            <span>0分</span> <i>视觉能力正常</i><br />
            <span>-</span> <i>-</i><br />
            <span>5分</span> <i>视觉能力中度障碍</i><br />
            <span>10分</span> <i>视觉能力重度障碍</i>
          </td>
          <td>1.评分总和</td>
          <td colspan="3">{{ projectVision[1].itemValue }}</td>
        </tr>
        <tr>
          <td>2.判断等级</td>
          <td colspan="3" class="pingfen pingfenpadd">
            <p>
              正常<input
                type="checkbox"
                :checked="projectVision[1].itemName == '正常' ? 'checked' : ''"
              />
            </p>
            <p>-</p>
            <p>
              中度障碍<input
                type="checkbox"
                :checked="projectVision[1].itemName == '中度' ? 'checked' : ''"
              />
            </p>
            <p>
              重度障碍<input
                type="checkbox"
                :checked="projectVision[1].itemName == '重度' ? 'checked' : ''"
              />
            </p>
          </td>
        </tr>
        <tr>
          <td>3.结论备注</td>
          <td colspan="3">{{ projectVision[2].remark }}</td>
        </tr>
      </table>
    </div>

    <!-- 参数项目五：社会生活环境 -->
    <div class="page">
      <table
        class="table12 table126"
        cellspacing="0"
        cellpadding="0"
        border="1"
      >
        <tr>
          <th colspan="6">《评估表参数项目》</th>
        </tr>
        <tr>
          <td colspan="6">参数项目五：社会生活环境（背景参数）</td>
        </tr>
        <tr>
          <td width="3%" class="cen">(1)居住情况</td>
          <td width="17%">老人居住、生活情况</td>
          <td width="20%">
            <input
              type="checkbox"
              :checked="
                projectSociety[0].itemName == '与子女或亲戚朋友同住'
                  ? 'checked'
                  : ''
              "
            />1.1 与子女或亲戚朋友同住。
          </td>
          <td width="20%">
            <input
              type="checkbox"
              :checked="
                projectSociety[0].itemName == '与配偶同住' ? 'checked' : ''
              "
            />1.2 与配偶同住。
          </td>
          <td width="20%">
            <input
              type="checkbox"
              :checked="
                projectSociety[0].itemName == '独自居住' ? 'checked' : ''
              "
            />1.3 独自居住。
          </td>
          <td width="20%">
            <input
              type="checkbox"
              :checked="
                projectSociety[0].itemName == '入住养老机构' ? 'checked' : ''
              "
            />1.4 入住养老机构。
          </td>
        </tr>
        <tr>
          <td class="cen">(2)家庭支持</td>
          <td>老人家庭、社会网络的支持情况。</td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[1].itemName ==
                '亲属提供足够的生活支持（物质和感情）'
                  ? 'checked'
                  : ''
              "
            />2.1 亲属提供足够的生活支持（物质和感情）。
          </td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[1].itemName == '亲属提供些许生活支持'
                  ? 'checked'
                  : ''
              "
            />2.2 亲属提供些许生活支持。
          </td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[1].itemName == '亲属只提供感情上的支持'
                  ? 'checked'
                  : ''
              "
            />2.3 亲属只提供感情上的支持。
          </td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[1].itemName == '很少看望，没有物质和感情支持'
                  ? 'checked'
                  : ''
              "
            />2.4 很少看望，没有物质和感情支持。
          </td>
        </tr>
        <tr>
          <td class="cen">(3)社区生活</td>
          <td>老人参与社区活动的情况。</td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[2].itemName == '经常参加社区活动'
                  ? 'checked'
                  : ''
              "
            />3.1 经常参加社区活动。
          </td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[2].itemName == '较少到社区走动或参加活动'
                  ? 'checked'
                  : ''
              "
            />3.2 较少到社区走动或参加活动。
          </td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[2].itemName == '偶尔到社区走动或参加活动'
                  ? 'checked'
                  : ''
              "
            />3.3 偶尔到社区走动或参加活动
          </td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[2].itemName == '从不参加社区活动'
                  ? 'checked'
                  : ''
              "
            />3.4 从不参加社区活动。
          </td>
        </tr>
        <tr>
          <td class="cen">(4)居住条件</td>
          <td>老人的住房设施和条件。</td>
          <td>
            4.1 出入无障碍设施<br />
            <input
              type="checkbox"
              :checked="projectSociety[3].itemName == '有' ? 'checked' : ''"
            />有<br />
            <input
              type="checkbox"
              :checked="projectSociety[3].itemName == '无' ? 'checked' : ''"
            />无
          </td>
          <td>
            4.2 室内无障碍设施<br />
            <input
              type="checkbox"
              :checked="projectSociety[4].itemName == '有' ? 'checked' : ''"
            />有<br />
            <input
              type="checkbox"
              :checked="projectSociety[4].itemName == '无' ? 'checked' : ''"
            />无
          </td>
          <td>
            4.3 厕所<br />
            <input
              type="checkbox"
              :checked="projectSociety[5].itemName == '独用' ? 'checked' : ''"
            />独用<br />
            <input
              type="checkbox"
              :checked="projectSociety[5].itemName == '合用' ? 'checked' : ''"
            />合用<br />
            <input
              type="checkbox"
              :checked="projectSociety[5].itemName == '无' ? 'checked' : ''"
            />无
          </td>
          <td>
            4.4 洗浴设备<br />
            <input
              type="checkbox"
              :checked="projectSociety[6].itemName == '独用' ? 'checked' : ''"
            />独用<br />
            <input
              type="checkbox"
              :checked="projectSociety[6].itemName == '合用' ? 'checked' : ''"
            />合用<br />
            <input
              type="checkbox"
              :checked="projectSociety[6].itemName == '无' ? 'checked' : ''"
            />无
          </td>
        </tr>
        <tr>
          <td class="cen">(5)安全卫生</td>
          <td>老人居住环境的卫生和安全。</td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[7].itemName == '环境条件符合老人生活卫生与安全'
                  ? 'checked'
                  : ''
              "
            />5.1 环境条件符合老人生活卫生与安全。
          </td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[7].itemName == '卫生条件陈旧，安全仍能保障'
                  ? 'checked'
                  : ''
              "
            />5.2 卫生条件陈旧，安全仍能保障。
          </td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[7].itemName ==
                '卫生条件较差，生活较不方便，安全缺乏保障'
                  ? 'checked'
                  : ''
              "
            />5.3 卫生条件较差，生活较不方便，安全缺乏保障。
          </td>
          <td>
            <input
              type="checkbox"
              :checked="
                projectSociety[7].itemName == '居住条件很差，有明显居住安全风险'
                  ? 'checked'
                  : ''
              "
            />5.4 居住条件很差，有明显居住安全风险。
          </td>
        </tr>
      </table>
    </div>

    <!-- 评估报告一：参数项目总分计算 -->
    <div class="page">
      <table
        class="table12 table127"
        cellspacing="0"
        cellpadding="0"
        border="1"
      >
        <tr>
          <th colspan="5">《评估报告》</th>
        </tr>
        <tr>
          <td colspan="5">评估报告一：参数项目总分计算</td>
        </tr>
        <tr>
          <td width="28%">参数项目</td>
          <td width="18%">生活自理能力</td>
          <td width="18%">认知能力</td>
          <td width="18%">情绪行为</td>
          <td width="18%">视觉能力</td>
        </tr>
        <tr>
          <td class="cen">评估分值</td>
          <td class="pinfen">
            <p>
              <span>正常</span
              ><input
                type="checkbox"
                :checked="projectLife[5].itemName == '正常' ? 'checked' : ''"
              /><i>0分</i>
            </p>
            <p>
              <span>轻度依赖</span
              ><input
                type="checkbox"
                :checked="projectLife[5].itemName == '轻度' ? 'checked' : ''"
              /><i>6分</i>
            </p>
            <p>
              <span>中度依赖</span
              ><input
                type="checkbox"
                :checked="projectLife[5].itemName == '中度' ? 'checked' : ''"
              /><i>18分</i>
            </p>
            <p>
              <span>重度依赖</span
              ><input
                type="checkbox"
                :checked="projectLife[5].itemName == '重度' ? 'checked' : ''"
              /><i>30分</i>
            </p>
          </td>
          <td class="pinfen">
            <p>
              <span>正常</span
              ><input
                type="checkbox"
                :checked="projectKnow[4].itemName == '正常' ? 'checked' : ''"
              /><i>0分</i>
            </p>
            <p>
              <span>轻度缺失</span
              ><input
                type="checkbox"
                :checked="projectKnow[4].itemName == '轻度' ? 'checked' : ''"
              /><i>3分</i>
            </p>
            <p>
              <span>中度缺失</span
              ><input
                type="checkbox"
                :checked="projectKnow[4].itemName == '中度' ? 'checked' : ''"
              /><i>9分</i>
            </p>
            <p>
              <span>重度缺失</span
              ><input
                type="checkbox"
                :checked="projectKnow[4].itemName == '重度' ? 'checked' : ''"
              /><i>15分</i>
            </p>
          </td>
          <td class="pinfen">
            <p>
              <span>正常</span
              ><input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '正常' ? 'checked' : ''"
              /><i>0分</i>
            </p>
            <p>
              <span>轻度异常</span
              ><input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '轻度' ? 'checked' : ''"
              /><i>1分</i>
            </p>
            <p>
              <span>中度异常</span
              ><input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '中度' ? 'checked' : ''"
              /><i>3分</i>
            </p>
            <p>
              <span>重度异常</span
              ><input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '重度' ? 'checked' : ''"
              /><i>5分</i>
            </p>
          </td>
          <td class="pinfen">
            <p>
              <span>正常</span
              ><input
                type="checkbox"
                :checked="projectVision[1].itemName == '正常' ? 'checked' : ''"
              /><i>0分</i>
            </p>
            <p><span>-</span><input type="checkbox" /><i>0分</i></p>
            <p>
              <span>中度障碍</span
              ><input
                type="checkbox"
                :checked="projectVision[1].itemName == '中度' ? 'checked' : ''"
              /><i>6分</i>
            </p>
            <p>
              <span>重度障碍</span
              ><input
                type="checkbox"
                :checked="projectVision[1].itemName == '重度' ? 'checked' : ''"
              /><i>50分</i>
            </p>
          </td>
        </tr>
        <tr>
          <td colspan="3">照料等级评分参考值</td>
          <td colspan="2">评估分数总结</td>
        </tr>
        <tr>
          <td class="cen">0 - 5分</td>
          <td colspan="2">正常</td>
          <td>1. 评估总分</td>
          <td>{{ careAssessTable.estimateScore }}</td>
        </tr>
        <tr>
          <td class="cen">6 - 17分</td>
          <td colspan="2">
            轻度<br />日常生活自理能力欠佳，需要提供一些帮助。
          </td>
          <td rowspan="3">2. 照料等级</td>
          <td rowspan="3" class="cen">
            正常
            <input
              type="checkbox"
              :checked="careAssessTable.levelName == '正常' ? 'checked' : ''"
            />
            <br />
            轻度
            <input
              type="checkbox"
              :checked="careAssessTable.levelName == '轻度' ? 'checked' : ''"
            />
            <br />
            中度
            <input
              type="checkbox"
              :checked="careAssessTable.levelName == '中度' ? 'checked' : ''"
            />
            <br />
            重度
            <input
              type="checkbox"
              :checked="careAssessTable.levelName == '重度' ? 'checked' : ''"
            />
          </td>
        </tr>
        <tr>
          <td class="cen">18 - 30分</td>
          <td colspan="2">
            中度<br />日常生活自理能力较差，需要提供较大帮助。
          </td>
        </tr>
        <tr>
          <td class="cen">31分或以上</td>
          <td colspan="2">
            重度<br />日常生活自理能力很差，需要提供很大帮助。
          </td>
        </tr>
        <tr height="200">
          <td class="cen">结论备注</td>
          <td colspan="4"></td>
        </tr>
      </table>
    </div>

    <!-- 评估报告二：评估员总结 -->
    <div class="page">
      <table
        class="table12 table128"
        cellspacing="0"
        cellpadding="0"
        border="1"
      >
        <tr>
          <th colspan="5">《评估报告》</th>
        </tr>
        <tr>
          <td colspan="5">评估报告二：评估员总结（参数项目的描述）</td>
        </tr>
        <tr>
          <td width="16%" rowspan="2" style="text-align:left;">
            (1) 生活自理能力
          </td>
          <td width="21%">程度等级</td>
          <td width="21%" class="pingfen128">
            <p>
              <input
                type="checkbox"
                :checked="projectLife[5].itemName == '正常' ? 'checked' : ''"
              />正常
            </p>
            <p>
              <input
                type="checkbox"
                :checked="projectLife[5].itemName == '轻度' ? 'checked' : ''"
              />轻度
            </p>
            <p>
              <input
                type="checkbox"
                :checked="projectLife[5].itemName == '中度' ? 'checked' : ''"
              />中度
            </p>
            <p>
              <input
                type="checkbox"
                :checked="projectLife[5].itemName == '重度' ? 'checked' : ''"
              />重度
            </p>
          </td>
        </tr>
        <tr>
          <td height="100" style="text-align:center;">评语</td>
          <td style="text-align:center;">{{ reportSum[0] }}</td>
        </tr>

        <tr>
          <td rowspan="2">(2) 认知能力</td>
          <td style="text-align:center;">程度等级</td>
          <td class="pingfen128">
            <p>
              <input
                type="checkbox"
                :checked="projectKnow[4].itemName == '正常' ? 'checked' : ''"
              />正常
            </p>
            <p>
              <input
                type="checkbox"
                :checked="projectKnow[4].itemName == '轻度' ? 'checked' : ''"
              />轻度
            </p>
            <p>
              <input
                type="checkbox"
                :checked="projectKnow[4].itemName == '中度' ? 'checked' : ''"
              />中度
            </p>
            <p>
              <input
                type="checkbox"
                :checked="projectKnow[4].itemName == '重度' ? 'checked' : ''"
              />重度
            </p>
          </td>
        </tr>
        <tr>
          <td height="100" style="text-align:center;">评语</td>
          <td style="text-align:center;">{{ reportSum[1] }}</td>
        </tr>

        <tr>
          <td rowspan="2">(3) 情绪行为</td>
          <td style="text-align:center;">程度等级</td>
          <td class="pingfen128">
            <p>
              <input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '正常' ? 'checked' : ''"
              />正常
            </p>
            <p>
              <input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '轻度' ? 'checked' : ''"
              />轻度
            </p>
            <p>
              <input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '中度' ? 'checked' : ''"
              />中度
            </p>
            <p>
              <input
                type="checkbox"
                :checked="projectEmotion[3].itemName == '重度' ? 'checked' : ''"
              />重度
            </p>
          </td>
        </tr>
        <tr>
          <td height="100" style="text-align:center;">评语</td>
          <td style="text-align:center;">{{ reportSum[2] }}</td>
        </tr>

        <tr>
          <td rowspan="2">(4) 视觉能力</td>
          <td style="text-align:center;">程度等级</td>
          <td class="pingfen128">
            <p>
              <input
                type="checkbox"
                :checked="projectVision[1].itemName == '正常' ? 'checked' : ''"
              />正常
            </p>
            <p>-</p>
            <p>
              <input
                type="checkbox"
                :checked="projectVision[1].itemName == '中度' ? 'checked' : ''"
              />中度
            </p>
            <p>
              <input
                type="checkbox"
                :checked="projectVision[1].itemName == '重度' ? 'checked' : ''"
              />重度
            </p>
          </td>
        </tr>
        <tr>
          <td height="100" style="text-align:center;">评语</td>
          <td style="text-align:center;">{{ reportSum[3] }}</td>
        </tr>

        <tr>
          <td rowspan="5">(5) 社会生活与环境</td>
          <td style="text-align:center;">居住情况</td>
          <td>{{ projectSociety[0].itemName }}</td>
        </tr>
        <tr>
          <td style="text-align:center;">家庭支持</td>
          <td>{{ projectSociety[1].itemName }}</td>
        </tr>
        <tr>
          <td style="text-align:center;">社区生活</td>
          <td>{{ projectSociety[2].itemName }}</td>
        </tr>
        <tr>
          <td style="text-align:center;">居住条件</td>
          <td>
            出入无障碍设施：{{ projectSociety[3].itemName }}<br />
            室内无障碍设施：{{ projectSociety[4].itemName }}<br />
            洗浴设备：{{ projectSociety[5].itemName }}<br />
            洗浴设备：{{ projectSociety[6].itemName }}<br />
          </td>
        </tr>
        <tr>
          <td style="text-align:center;">安全卫生</td>
          <td>{{ projectSociety[7].itemName }}</td>
        </tr>
      </table>
    </div>

    <!-- 评估报告三：养老服务建议 -->
    <div class="page">
      <table
        class="table12 table129"
        cellspacing="0"
        cellpadding="0"
        border="1"
      >
        <tr>
          <th colspan="6">《评估报告》</th>
        </tr>
        <tr>
          <td colspan="6">评估报告三：养老服务建议</td>
        </tr>
        <tr>
          <td width="5%" rowspan="25" class="cen">
            服务建议（急需服务请用“★”表示）
          </td>
          <td width="30%" colspan="2">服务内容</td>
          <td width="18%">需要</td>
          <td width="30%">服务频次</td>
          <td width="17%">备注</td>
        </tr>
        <tr>
          <td colspan="2">送餐</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">上门做餐</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">洗漱</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">个人清洁卫生</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">洗澡</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">理发</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">陪诊</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">购物</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">康复指导</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">康复训练</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">洗衣</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">打扫房间</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>

        <tr>
          <td rowspan="8" class="cen" width="10%">卧床老人生活基础护理</td>
          <td>喂食</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>晨间护理</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>晚间护理</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>翻身</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>排泄监护</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>帮助服药</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>褥疮护理</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每日&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>擦浴</td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td rowspan="4" class="cen">其他服务</td>
          <td></td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td><input type="checkbox" />是<input type="checkbox" />否</td>
          <td>
            每月&emsp;{{ oldSuggest[0].remark }}&emsp;次&emsp;必要时<input
              type="checkbox"
            />
          </td>
          <td></td>
        </tr>
        <tr height="80">
          <td>建议服务模式</td>
          <td colspan="2">
            <input
              type="checkbox"
              :checked="oldSuggest[15].itemName == '居家养老' ? 'checked' : ''"
            />居家养老 <br />
            <input
              type="checkbox"
              :checked="oldSuggest[15].itemName == '机构养老' ? 'checked' : ''"
            />机构养老
          </td>
          <td colspan="3">原因：{{ oldSuggest[15].remark }}</td>
        </tr>
      </table>
    </div>

    <!-- 评估报告四：确认评估报告 -->
    <div class="page">
      <table
        class="table12 table130"
        cellspacing="0"
        cellpadding="0"
        border="1"
      >
        <tr>
          <th colspan="6">《评估报告》</th>
        </tr>
        <tr>
          <td colspan="6">评估报告四：确认评估报告</td>
        </tr>
        <tr>
          <td colspan="6">评估表基本信息</td>
        </tr>
        <tr>
          <td colspan="2">评估表<br />号码</td>
          <td colspan="2" width="38%">
            (&emsp;&emsp;&emsp;)-(&emsp;&emsp;&emsp;)-<br />区县号 街道号
          </td>
          <td width="15%">完成日期</td>
          <td width="35%">&emsp;年&emsp;&emsp;月&emsp;&emsp;日</td>
        </tr>

        <tr>
          <td colspan="2">区县／街镇</td>
          <td colspan="2">区县：&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;编号：</td>
          <td colspan="2">街镇：&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;编号：</td>
        </tr>
        <tr>
          <td rowspan="4" width="5%" style="text-align:center;">
            (1)评估员确认完成
          </td>
          <td colspan="2">评估员姓名</td>
          <td width="23%"></td>
          <td rowspan="2">确认完成</td>
          <td rowspan="2">
            首次评估<input type="checkbox" /><br />
            复核评估<input type="checkbox" /><br />
            持续评估<input type="checkbox" />
          </td>
        </tr>
        <tr>
          <td colspan="2">联络电话</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">所属单位</td>
          <td colspan="3">{{ nursingHomeName }}</td>
        </tr>
        <tr height="80">
          <td colspan="5" class="qianming130">
            评估员签名<span class="s1">(盖章)</span> 日期
            <span class="s2">年 月 日</span>
          </td>
        </tr>
        <tr>
          <td rowspan="4" style="text-align:center;">(2)指导员抽查</td>
          <td colspan="2">指导员姓名</td>
          <td></td>
          <td rowspan="2">检查评估标准</td>
          <td rowspan="2">
            符合评估标准<input type="checkbox" /><br />
            建议再次评估<input type="checkbox" />
          </td>
        </tr>
        <tr>
          <td colspan="2">联络电话</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">所属单位</td>
          <td colspan="3">{{ nursingHomeName }}</td>
        </tr>
        <tr height="80">
          <td colspan="5" class="qianming130">
            指导员签名<span class="s1">(盖章)</span> 日期
            <span class="s2">年 月 日</span>
          </td>
        </tr>
        <tr>
          <td rowspan="4" style="text-align:center;">(3)街镇管理部门确认</td>
          <td colspan="2">负责人姓名</td>
          <td></td>
          <td rowspan="2">确认评估报告</td>
          <td rowspan="2">
            确认评估结果<input type="checkbox" /><br />
            要求再次评估<input type="checkbox" />
          </td>
        </tr>
        <tr>
          <td colspan="2">联络电话</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">所属单位</td>
          <td colspan="3"></td>
        </tr>
        <tr height="80">
          <td colspan="5" class="qianming130">
            负责人签名<span class="s1">(盖章)</span> 日期
            <span class="s2">年 月 日</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import tenant from "@/components/_tenant";
export default {
  props: {
    elderData: {
      type: Object,
      default() {
        return {
          elderId: "",
          baseInfo: {}, //基础信息和入住管理的数据
          familyData: {}, //家属信息
          healthInfo: {} //健康状况
        };
      }
    }
  },
  data() {
    return {
      estimateId: "",
      careAssessTable: {},
      projectLife: [
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: "",
          itemValue: ""
        },
        {
          remark: ""
        }
      ],
      projectKnow: [
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: "",
          itemValue: ""
        },
        {
          remark: ""
        }
      ],
      projectEmotion: [
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: "",
          itemValue: ""
        },
        {
          remark: ""
        }
      ],
      projectVision: [
        {
          itemName: ""
        },
        {
          itemName: "",
          itemValue: ""
        },
        {
          remark: ""
        }
      ],
      projectEar: [
        {
          itemName: ""
        },
        {
          itemName: "",
          itemValue: ""
        },
        {
          remark: ""
        }
      ],
      projectSociety: [
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: ""
        },
        {
          itemName: "",
          itemValue: ""
        },
        {
          remark: ""
        }
      ],
      reportSum: ["", "", "", ""],
      reportSociety: ["", "", "", ""],
      oldSuggest: [
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        },
        {
          itemName: "",
          remark: ""
        }
      ],
      nursingHomeName: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      tenant.fetchCurrentTenant().then(t => {
        this.nursingHomeName = t.tenantName; // 租户名称
      });
      this.estimateId = this.$route.query.estimateId;
      this.assembleData();
    })
  },
  methods: {
    //处理数据
    assembleData() {
      this.changeData();
    },
    //老人变更事项数据
    changeData() {
      //老人id为空时便根据照护评估id查询
      let data = {};
      if (this.$route.query.elderId) {
        //入住管理过来的打印
        data = {
          elderId: this.$route.query.elderId
        };
      } else if (this.estimateId) {
        //照护评估过来的打印
        data = {
          estimateId: this.estimateId
        };
      }
      console.log(data)
      axios.fetch("elderServer", "/elderEstimate/print", data).then(res => {
        this.assembleChange(res.data);
      });
    },
    //处理变更数据
    assembleChange(data) {
      // console.log(data,'==========data')
      this.careAssessTable = data;
      this.careAssessTable.addEstimateItemVos.map(item => {
        console.log(
          item.itemType,
          item.itemCategory,
          item.itemTitle,
          item.itemName,
          "====",
          item
        );
        if (
          item.itemType === "评估项目" &&
          item.itemCategory === "生活自理能力"
        ) {
          if (item.itemTitle === "进食") {
            this.projectLife[0] = item;
          } else if (item.itemTitle === "个人卫生") {
            this.projectLife[1] = item;
          } else if (item.itemTitle === "穿衣") {
            this.projectLife[2] = item;
          } else if (item.itemTitle === "如厕及排泄") {
            this.projectLife[3] = item;
          } else if (item.itemTitle === "移动") {
            this.projectLife[4] = item;
          } else if (item.itemTitle === "程度等级") {
            this.projectLife[5] = item;
            this.reportSum[0] = item.doctorRemark;
          } else if (item.itemTitle === "备注") {
            this.projectLife[6] = item;
          }
        } else if (
          item.itemType === "评估项目" &&
          item.itemCategory === "认知能力"
        ) {
          if (item.itemTitle === "近期记忆") {
            this.projectKnow[0] = item;
          } else if (item.itemTitle === "程序记忆") {
            this.projectKnow[1] = item;
          } else if (item.itemTitle === "定向能力") {
            this.projectKnow[2] = item;
          } else if (item.itemTitle === "判断能力") {
            this.projectKnow[3] = item;
          } else if (item.itemTitle === "程度等级") {
            this.projectKnow[4] = item;
            this.reportSum[1] = item.doctorRemark;
          } else if (item.itemTitle === "备注") {
            this.projectKnow[5] = item;
          }
        } else if (
          item.itemType === "评估项目" &&
          item.itemCategory === "情绪行为"
        ) {
          if (item.itemTitle === "情绪") {
            this.projectEmotion[0] = item;
          } else if (item.itemTitle === "行为") {
            this.projectEmotion[1] = item;
          } else if (item.itemTitle === "沟通能力") {
            this.projectEmotion[2] = item;
          } else if (item.itemTitle === "程度等级") {
            this.projectEmotion[3] = item;
            this.reportSum[2] = item.doctorRemark;
          } else if (item.itemTitle === "备注") {
            this.projectEmotion[4] = item;
          }
        } else if (
          item.itemType === "评估项目" &&
          item.itemCategory === "视觉能力"
        ) {
          console.log(item);
          if (item.itemTitle === "视力") {
            this.projectVision[0] = item;
          } else if (item.itemTitle === "程度等级") {
            this.projectVision[1] = item;
            this.reportSum[3] = item.doctorRemark;
          } else if (item.itemTitle === "备注") {
            this.projectVision[2] = item;
          } else if (item.itemTitle === "听觉") {
            this.projectVision[3] = item;
          }
        } else if (
          item.itemType === "评估项目" &&
          item.itemCategory === "听力"
        ) {
          this.projectEar.push(item);
        } else if (
          item.itemType === "评估项目" &&
          item.itemCategory === "社会生活环境"
        ) {
          if (item.itemTitle === "居住情况") {
            this.projectSociety[0] = item;
          } else if (item.itemTitle === "家庭支持") {
            this.projectSociety[1] = item;
          } else if (item.itemTitle === "社区生活") {
            this.projectSociety[2] = item;
          } else if (item.itemTitle === "居住条件（出入无障碍设施）") {
            this.projectSociety[3] = item;
          } else if (item.itemTitle === "居住条件（室内无障碍设施）") {
            this.projectSociety[4] = item;
          } else if (item.itemTitle === "居住条件（厕所）") {
            this.projectSociety[5] = item;
          } else if (item.itemTitle === "居住条件（洗浴设备）") {
            this.projectSociety[6] = item;
          } else if (item.itemTitle === "安全卫生") {
            this.projectSociety[7] = item;
          }
        } else if (
          item.itemType === "评估报告" &&
          item.itemCategory != "社会生活与环境"
        ) {
          if (item.itemCategory === "生活能力") {
            this.reportSum[0] = item.itemName;
          } else if (item.itemCategory === "认知能力") {
            this.reportSum[1] = item.itemName;
          } else if (item.itemCategory === "情绪行为") {
            this.reportSum[2] = item.itemName;
          } else if (item.itemCategory === "视觉听觉") {
            this.reportSum[3] = item.itemName;
          }
        } else if (item.itemType === "养老服务建议") {
          if (item.itemTitle === "送餐") {
            this.oldSuggest[0] = item;
          } else if (item.itemTitle === "进食") {
            this.oldSuggest[1] = item;
          } else if (item.itemTitle === "修饰与洗浴") {
            this.oldSuggest[2] = item;
          } else if (item.itemTitle === "穿(脱)衣") {
            this.oldSuggest[3] = item;
          } else if (item.itemTitle === "如厕及排泄") {
            this.oldSuggest[4] = item;
          } else if (item.itemTitle === "移动") {
            this.oldSuggest[5] = item;
          } else if (item.itemTitle === "压疮处理") {
            this.oldSuggest[6] = item;
          } else if (item.itemTitle === "用药") {
            this.oldSuggest[7] = item;
          } else if (item.itemTitle === "物品整理") {
            this.oldSuggest[8] = item;
          } else if (item.itemTitle === "物品清洁消毒") {
            this.oldSuggest[9] = item;
          } else if (item.itemTitle === "洗涤") {
            this.oldSuggest[10] = item;
          } else if (item.itemTitle === "打扫房间") {
            this.oldSuggest[11] = item;
          } else if (item.itemTitle === "陪诊") {
            this.oldSuggest[12] = item;
          } else if (item.itemTitle === "购物") {
            this.oldSuggest[13] = item;
          } else if (item.itemTitle === "康复保健") {
            this.oldSuggest[14] = item;
          } else if (item.itemTitle === "建议服务形式") {
            this.oldSuggest[15] = item;
          }
        }
      });
      let arr1 = {
        正常: 0,
        轻度: 6,
        中度: 18,
        重度: 30
      };
      let arr2 = {
        正常: 0,
        轻度: 3,
        中度: 9,
        重度: 15
      };
      let arr3 = {
        正常: 0,
        轻度: 1,
        中度: 3,
        重度: 5
      };
      let arr4 = {
        正常: 0,
        轻度: 0,
        中度: 6,
        重度: 50
      };
      let value1 = arr1[this.projectLife[5].itemName];
      let value2 = arr2[this.projectKnow[4].itemName];
      let value3 = arr3[this.projectEmotion[3].itemName];
      let value4 = arr4[this.projectVision[1].itemName];
      console.log(value1, value2, value3, value4);
      this.careAssessTable.estimateScore =
        parseInt(value1) +
        parseInt(value2) +
        parseInt(value3) +
        parseInt(value4);
      console.log(this.careAssessTable.estimateScore, "====projectVision");
    }
  },
  filters: {
    dateFormat: date => {
      if (date) {
        date =
          date.split("-")[0] +
          "年" +
          date.split("-")[1] +
          "月" +
          date.split("-")[2] +
          "日";
      } else {
        date = "";
      }
      return date;
    },
    typeFilter: val => {
      if (val === 0) {
        val = "首次评估";
      } else if (val === 1) {
        val = "复核评估";
      } else if (val === 2) {
        val = "持续性评估";
      }
      return val;
    }
  },
  computed: {
    ev_combined1() {},
    ev_combined2() {
      let sum = 0;
      this.form[1].ev_items_grade.map(item => {
        let score = 0;
        switch (item.ev_grade) {
          case "正常":
            score = 0;
            break;
          case "轻度缺失":
            score = 1;
            break;
          case "中度缺失":
            score = 5;
            break;
          case "重度缺失":
            score = 10;
            break;
          default:
            score = 0;
            break;
        }
        sum = sum + score;
      });
      this.form[1].ev_combined = sum;
      return sum;
    },
    ev_combined3() {
      let sum = 0;
      this.form[2].ev_items_grade.map(item => {
        let score = 0;
        switch (item.ev_grade) {
          case "正常":
            score = 0;
            break;
          case "轻度异常":
            score = 1;
            break;
          case "中度异常":
            score = 5;
            break;
          case "重度异常":
            score = 10;
            break;
          default:
            score = 0;
            break;
        }
        sum = sum + score;
      });
      this.form[2].ev_combined = sum;
      return sum;
    },
    ev_combined4() {
      let sum = 0;
      [this.form[3].ev_items_grade[0]].map(item => {
        let score = 0;
        switch (item.ev_grade) {
          case "正常":
            score = 0;
            break;
          case "中度障碍":
            score = 5;
            break;
          case "重度障碍":
            score = 10;
            break;
          default:
            score = 0;
            break;
        }
        sum = sum + score;
      });
      this.form[3].ev_combined = sum;
      return sum;
    },
    firstZhuTi: {
      get() {
        return this.$store.getters.firstColors;
      },
      set() {}
    }
  }
};
</script>
<style lang="less" scoped>
.table12 {
  text-align: left;
  margin: 40px auto 0;
  tr {
    td {
      padding: 5px;

      &.cen {
        text-align: center;
      }
      &.right {
        text-align: right;
      }
      span {
        display: inline-block;
        vertical-align: top;
        width: 100px;
        text-align: right;
      }
      i {
        display: inline-block;
        vertical-align: top;
        width: 160px;
        font-style: normal;
        text-align: left;
      }
    }
    th {
      background: #ccc;
    }
    &:nth-child(1) {
      text-align: center;
      height: 70px;
    }
    &:nth-child(2) {
      text-align: left;
      height: 70px;
      td {
        padding-left: 10px;
      }
    }
    &:nth-child(3),
    &:nth-child(4) {
      text-align: center;
      height: 50px;
    }
  }
}
.table121 {
  margin-top: 0;
  tr {
    &:nth-child(3),
    &:nth-child(4) {
    }
    &:nth-child(10),
    &:nth-child(11) {
      text-align: left;
      td {
        padding-left: 10px;
      }
    }
  }
}

.table122 {
  width: 100%;
  tr {
    &:nth-child(1),
    &:nth-child(5) {
      height: 80px;
    }
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      height: 50px;
      text-align: center;
    }
    td {
      span {
        display: inline-block;
        vertical-align: top;
        width: 100px;
        text-align: right;
      }
      i {
        display: inline-block;
        vertical-align: top;
        width: 160px;
        font-style: normal;
        text-align: left;
      }

      &.pingfen {
        padding-right: 30px;
        input {
          margin-left: 8px;
        }
      }
    }
  }
}

.table123 {
  tr {
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(7),
    &:nth-child(8) {
      height: 120px;
    }
    &:nth-child(9),
    &:nth-child(10),
    &:nth-child(12) {
      height: 30px;
    }
    &:nth-child(11) {
      height: 110px;
    }
  }
}

.table124 {
  tr {
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(7) {
      height: 120px;
    }
    &:nth-child(8),
    &:nth-child(9),
    &:nth-child(11) {
      height: 30px;
    }
    &:nth-child(10) {
      height: 110px;
    }
  }
}

.table125 {
  tr {
    &:nth-child(5) {
      height: 120px;
    }
    &:nth-child(6),
    &:nth-child(7),
    &:nth-child(9) {
      height: 30px;
    }
    &:nth-child(8) {
      height: 110px;
    }
  }
}

.table126 {
  tr {
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6) {
      height: 150px;
      text-align: left;
      input {
        margin-right: 5px;
      }
    }
  }
}

.table127 {
  tr {
    td {
      &.pinfen {
        p {
          width: 135px;
          margin: 0 auto;
          span {
            display: inline-block;
            vertical-align: top;
            width: 70px;
          }
          input {
            margin: 0 5px;
          }
          i {
            display: inline-block;
            vertical-align: top;
            width: 40px;
          }
        }
      }
    }
    &:nth-child(3),
    &:nth-child(5) {
      height: 50px;
    }
    &:nth-child(4) {
      height: 150px;
    }
    &:nth-child(6) {
      height: 60px;
    }
    &:nth-child(7),
    &:nth-child(8),
    &:nth-child(9) {
      height: 90px;
    }
    &:nth-child(10) {
      height: 200px;
    }
  }
}
.table128 {
  tr {
    &:nth-child(3),
    &:nth-child(5),
    &:nth-child(7),
    &:nth-child(9) {
      height: 30px;
    }
    &:nth-child(4),
    &:nth-child(6),
    &:nth-child(8),
    &:nth-child(10) {
      height: 100px;
    }
    &:nth-child(11),
    &:nth-child(12),
    &:nth-child(13),
    &:nth-child(14) {
      height: 45px;
    }
  }
}
.pingfen128 {
  p {
    float: left;
    width: 60px;
    input {
      margin-right: 5px;
    }
  }
}
.table129 {
  tr {
    height: 28px;
    &:nth-child(2) {
      height: 30px;
      td {
        text-align: left;
      }
    }
    &:nth-child(3) {
      height: 31px;
    }
    &:nth-child(4) {
      height: 31px;
      text-align: left;
    }
    &:last-child {
      height: 150px;
      text-align: left;
      td {
        text-align: left;
      }
    }
    td {
      padding: 2px;
      text-align: center;
      input {
        margin: 0 4px 0 20px;
      }
      &:last-child {
        input {
          margin: 0 15px 0 4px;
        }
      }
    }
  }
}
.table130 {
  input {
    margin-left: 10px;
  }
  tr {
    height: 35px;
    &:nth-child(9),
    &:nth-child(13),
    &:nth-child(17) {
      height: 100px;
    }
    td {
      &.qianming130 {
        text-align: right;
        vertical-align: bottom;
        padding-bottom: 20px;
        span {
          border-bottom: 1px solid #333;
          display: inline-block;
          vertical-align: top;
          text-align: right;
          &.s1 {
            width: 220px;
            margin-right: 20px;
          }
          &.s2 {
            width: 200px;
            letter-spacing: 20px;
          }
        }
      }
    }
  }
}
.inputcon {
  p {
    float: left;
    width: 110px;
    text-align: left;
  }
}
.inputcon1 {
  p {
    width: 220px;
  }
}
.inputco2 {
  text-align: left;
  p {
    width: 110px;
    i {
      width: 110px;
      height: 21px;
      display: inline-block;
      vertical-align: top;
      border-bottom: 1px solid #333;
    }
  }
}

.pingfen {
  p {
    text-align: right;
    padding-right: 8px;
  }
}
.pingfenpadd {
  p {
    padding-right: 40%;
  }
}

.dic {
  width: 600px;
  margin: 0 auto;
  color: #333;
  h4 {
    color: #333;
    line-height: 40px;
    margin-top: 15px;
    padding-left: 10px;
    font-weight: normal;
  }
  p {
    line-height: 35px;
    padding-left: 20px;
    margin-top: 10px;
    border-bottom: 1px solid #222;
    position: relative;
    i {
      position: absolute;
      top: 0;
      right: 15px;
      font-style: normal;
    }
  }
}

.tit {
  text-align: center;
  font-weight: normal;
  margin: 20px 0 0;
  font-size: 20px;
}
.info {
  width: 650px;
  color: #333;
  margin: 0 auto;
  line-height: 30px;
  margin-top: 40px;
  p {
    margin: 40px 0;
    span {
      display: inline-block;
      width: 260px;
      text-align: right;
      vertical-align: top;
      line-height: 30px;
    }
    i {
      width: 290px;
      margin-left: 10px;
      border-bottom: 1px solid #333;
      font-style: normal;
      display: inline-block;
      vertical-align: top;
      text-align: center;
      height: 30px;
      line-height: 30px;
      white-space: nowrap;
    }
    &.a {
      span {
        letter-spacing: 8px;
      }
    }
    &.b {
      span {
        letter-spacing: 20px;
      }
      // i {
      //   letter-spacing: 10px;
      // }
    }
    &.c {
      line-height: 30px;
      height: 30px;
      span {
        letter-spacing: 27px;
        line-height: 30px;
      }
      i {
        height: 30px;
        input {
          margin-left: 10px;
        }
      }
    }
    &.d {
      span {
        letter-spacing: 13px;
      }
      i.space {
        letter-spacing: 50px;
        padding-left: 60px;
        box-sizing: border-box;
      }
    }
    &.e {
      span {
        letter-spacing: 18px;
      }
    }
    &.f {
      span {
        letter-spacing: 27px;
      }
      i {
        letter-spacing: 50px;
        box-sizing: border-box;
        padding-left: 60px;
      }
    }
  }
}
.server {
  width: 700px;
  color: #333;
  margin: 10px auto;
  h3 {
    padding-left: 20px;
    margin-top: 20px;
    font-weight: normal;
  }
  table {
    width: 100%;
    text-align: center;
    margin-top: 10px;
    border: 1px solid #333;
    tr {
      height: 37px;
      td {
        padding: 5px;
        &.address {
          text-align: left;
          span {
            margin-left: 40px;
          }
        }
      }
    }
  }
}

.qianming {
  box-sizing: border-box;
  text-align: right;
  td {
    vertical-align: bottom;
    padding-bottom: 10px;
    span {
      display: inline-block;
      vertical-align: top;
      border-bottom: 1px solid #333;
      text-align: center;
      box-sizing: border-box;
      &.s1 {
        width: 300px;
        text-align: right;
        padding-right: 10px;
      }
      &.s2 {
        width: 250px;
        letter-spacing: 20px;
      }
    }
  }
}
</style>
