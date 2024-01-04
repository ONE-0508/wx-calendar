/*
 * Copyright 2023 lspriv. All Rights Reserved.
 * Distributed under MIT license.
 * See File LICENSE for detail or copy at https://opensource.org/licenses/MIT
 * @Description: 组件实例
 * @Author: lishen
 * @LastEditTime: 2024-01-04 14:41:53
 */
import type { CalendarDay, WxCalendar, WxCalendarMonth, WxCalendarYear, WxCalendarSubYear } from './calendar';
import type { CalendarPointer, CalendarView } from '../basic/tools';
import type { View } from '../basic/constants';
import type { Pointer } from '../basic/pointer';
import type { PanelTool } from '../basic/panel';
import type { Dragger } from '../basic/drag';
import type { AnnualPanelSwitch } from '../basic/annual';
import type { YearPrinter } from '../basic/printer';
import type { CalendarLayout } from '../basic/layout';
import type { Nullable, Voidable } from '../utils/shared';
import type { LunarPlugin } from '../plugins/lunar';
import type { MarkPlugin } from '../plugins/mark';
import type { PluginConstructor, PluginKeys, PulginMap } from 'src/basic/service';

export interface CalendarPanel extends WxCalendarMonth {
  /** 面板垂直偏移量 */
  offset: number;
}

export interface CalendarWeek {
  key: string;
  label: string;
}

export type CalendarSwiperType = 'panel' | 'annual';

type FullProperty<T extends WechatMiniprogram.Component.PropertyType> = WechatMiniprogram.Component.FullProperty<T>;

export interface CalendarData extends WechatMiniprogram.Component.DataOption {
  /** 渲染模式 */
  renderer: 'webview' | 'skyline' | 'unknown';
  /** 选中日期 */
  checked: Nullable<CalendarDay>;
  /** 周/月面板数据 */
  panels: Array<CalendarPanel>;
  /** 周标题 */
  weeks: Array<CalendarWeek>;
  /** 年面板数据 */
  years: Array<WxCalendarYear>;
  /** 周/月面板swiper当前所在滑块 */
  current: number;
  /** 年面板swiper当前所在滑块 */
  annualCurr: Nullable<number>;
  /** [webview] 控制年面板容器的垂直起始位置 */
  annualTop: number | string;
  /** [webview] 控制年面板容器的透明度 */
  annualOpacity: number;
  /** [webview] 控制年面板swiper的动画时长 */
  annualDuration: number;
  /** 当前视图 */
  currView: CalendarView;
  /** [webview] 控制初始化视图（无过渡） */
  initView: CalendarView;
  /** [webview] 手动控制视图（过渡效果） */
  transView: Nullable<CalendarView>;
  /** 是否固定视图 */
  viewFixed: boolean;
  /** [webview] 周视图下强制更新各面板的垂直偏移量 */
  offsetChange: boolean;
  /** 布局数据 */
  layout: Nullable<Omit<CalendarLayout, 'subHeight' | 'windowWidth' | 'windowHeight'>>;
  /** 选中日期的额外信息 */
  info: string;
  /** 控制选中日期的圆圈⭕️位置和动画 */
  pointer: Nullable<CalendarPointer>;
  /** 日历字体 */
  fonts: string;
}

export interface CalendarProp extends WechatMiniprogram.Component.PropertyOption {
  /** 暗黑模式 */
  darkmode: FullProperty<BooleanConstructor>;
  /** 默认选中日期 */
  date: FullProperty<StringConstructor> | FullProperty<NumberConstructor>;
  /** 日程、角标和节假日 */
  marks: FullProperty<ArrayConstructor>;
  /** 视图分月视图，周视图和日程视图 */
  view: FullProperty<StringConstructor>;
  /** 字体，默认 system-ui */
  font: FullProperty<StringConstructor>;
  /** 容器样式 */
  style: FullProperty<StringConstructor>;
  /** 周首日，0 | 1 | 2 | 3 | 4 | 5 | 6 分别对应 日 | 一 | 二 | 三 | 四 | 五 | 六 */
  weekstart: FullProperty<NumberConstructor>;
  /** 点击选择日期时是否震动 */
  vibrate: FullProperty<BooleanConstructor>;
  /**
   * 是否自定义导航栏
   * 用以调整年面板的布局
   */
  customNavBar: FullProperty<BooleanConstructor>;
}

interface CalendarInitialize {
  /**
   * 初始化必需的共享变量
   * INFO: 在attached生命周期内声明的共享变量在组件实例的worklet函数中拿不到，所以放到created生命周期内初始化
   */
  initializeDatas(): void;
  /**
   * 初始化视图相关的数据
   */
  initializeView(): void;
  /**
   * 初始化一些工具对象和组件实例数据
   */
  initializeRender(): void;
  /**
   * 计算日期中心水平位置和是否自定义导航栏的判断，返回是否自定义导航栏
   * effect
   */
  initializeRects(): Promise<void>;
}

type TouchEvent<
  S extends WechatMiniprogram.IAnyObject,
  D extends WechatMiniprogram.IAnyObject = {},
  M extends WechatMiniprogram.IAnyObject = {}
> = WechatMiniprogram.TouchEvent<D, M, S>;

type SwiperTransitionEvent<
  D extends WechatMiniprogram.IAnyObject = {},
  M extends WechatMiniprogram.IAnyObject = {}
> = WechatMiniprogram.SwiperTransition<M, D>;

type SwiperAnimationFinishEvent<
  D extends WechatMiniprogram.IAnyObject = {},
  M extends WechatMiniprogram.IAnyObject = {}
> = WechatMiniprogram.SwiperAnimationFinish<M, D>;

type DEFAULT_PLUGINS = [typeof LunarPlugin, typeof MarkPlugin];

interface CalendarEventHandlers {
  /**
   * 跳转到今日
   */
  toToday(event: TouchEvent<{}>): void;
  /**
   * 点击选择日期
   */
  selDate(event: TouchEvent<{ wdx: number; ddx: number }>): void;
  /**
   * 点击周/月面板标题打开年面板选择年
   */
  selYear(event: TouchEvent<{}>): void;
  /**
   * 年面板中选择月
   */
  selMonth(event: TouchEvent<{ ydx: number }, { x: number; y: number }>): void;
  /**
   * 切换视图，周/月视图切换
   */
  toggleView(event: TouchEvent<{}> | View, fixed?: boolean): void;
  /**
   * [WebView] 处理周/月面板的swiper滑块位置变动
   */
  swiperTrans(event: SwiperTransitionEvent<{ type: CalendarSwiperType }>): void;
  /**
   * [WebView] 处理周/月面板的swiper滑块变动结束
   */
  swiperTransEnd(event: SwiperAnimationFinishEvent<{ type: CalendarSwiperType }>): void;
  /**
   * [Skyline] 处理周/月面板的swiper滑动结束
   */
  workletSwiperTransEnd(event: WechatMiniprogram.SwiperTransition): void;
  /**
   * [Skyline] 处理周/月面板的手势拖动
   */
  workletDragGesture(event: WechatMiniprogram.GragGestureEvent): void;
  /**
   * [Skyline] 处理年面板的swiper滑动结束
   */
  workletAnnualSwiperTransEnd(event: WechatMiniprogram.SwiperTransition): void;
  /**
   * 处理选中日期圆圈的动画结束
   */
  handlePointerAnimated(): void;
  /**
   * [WebView] 处理日历面板过渡结束
   */
  calendarTransitionEnd(): void;
}

interface CalendarTrigger {
  triggerLoad(): void;
  triggerDateChange(date?: CalendarDay): void;
  triggerViewChange(view?: View): void;
}

export interface CalendarMethod
  extends WechatMiniprogram.Component.MethodOption,
    CalendarInitialize,
    CalendarEventHandlers,
    CalendarTrigger {
  /**
   * 刷新周/月面板数据
   * 单独写这个方法是worklet的需要
   */
  refreshPanels(...args: Parameters<PanelTool['refresh']>): void;
  /**
   * 刷新年面板数据
   */
  refreshAnnualPanels(...args: Parameters<PanelTool['refreshAnnualPanels']>): void;
  /**
   * 视图刷新后刷新周/月面板数据
   */
  refreshView(state: { view: View }): void;
  /**
   * [Skyline] 处理周/月面板手势拖动开始
   */
  dragGestureStart(): void;
  /**
   * [Skyline] 处理周/月面板手势拖动结束
   */
  dragGestureEnd(event: WechatMiniprogram.GragGestureEvent): Promise<void>;
}

export interface CalendarCustomProp extends WechatMiniprogram.IAnyObject {
  /** 加载状态 */
  _loaded_: boolean;
  /** 当前视图的flag */
  _view_: View;
  /** 日期中心水平坐标 */
  _centres_: Array<number>;
  /** 保存和视图无关的年度数据，和data里的years一一对应 */
  _years_: Array<WxCalendarSubYear>;
  /** 控制选中日期圆圈的实例对象 */
  _pointer_: Pointer;
  /** 处理周/月/年面板数据的实例对象 */
  _panel_: PanelTool;
  /** [Skyline] 控制周/月面板手势拖动的实例对象 */
  _dragger_?: Dragger;
  /** 控制年面板的实例对象 */
  _annual_: AnnualPanelSwitch;
  /** 处理年面板数据渲染的实例对象 */
  _printer_: YearPrinter;
  /** 处理数据渲染和服务注册的实例对象 */
  _calendar_: WxCalendar<DEFAULT_PLUGINS>;
  /**
   * [Webview] Swiper组件transition事件dx（或dy）初始值为初始所在滑块的位置偏移量
   * 这个值用在首次触摸判断，进一步判断dx初始值是否被消费
   */
  _swiper_flag_: boolean;
  /** [Webview] Swiper滑动累积偏移量，Swiper滑动结束后用来判断滑动了几个滑块 */
  _swiper_accumulator_: number;
  /** 周/月面板保存连续滑动中累积的偏移量 */
  $_swiper_trans: Shared<number>;
  /** 年面板保存连续滑动中累积的偏移量 */
  $_annual_trans: Shared<number>;
  /** 是否固定视图 */
  $_view_fixed: Shared<boolean>;
  /** [Skyline] 当前周/月面板所在滑块，worklet函数中使用 */
  $_current?: Shared<number>;
  /** [Skyline] 周/月面板手势拖动状态 */
  $_drag_state?: Shared<0 | 1>;
  /** [Skyline] 周/月面板容器高度 */
  $_drag_calendar_height?: Shared<number>;
  /** [Skyline] 周/月面板各面板垂直偏移量 */
  $_drag_panel_trans?: Shared<Array<Shared<number>>>;
  /** [Skyline] 周/月面板底部控制条角度 */
  $_drag_bar_rotate?: Shared<number>;
  /** [Skyline] 周/月面板日程透明度 */
  $_drag_schedule_opacity?: Shared<number>;
  /** [Skyline] 周/月面板右上方视图控制 */
  $_drag_view_bar_translate_?: Shared<number>;
}

export type CalendarInstance = WechatMiniprogram.Component.Instance<
  CalendarData,
  CalendarProp,
  CalendarMethod,
  CalendarCustomProp
>;

type DefaultPluginKeyExtend<T extends Array<PluginConstructor>> = PluginKeys<T> | PluginKeys<DEFAULT_PLUGINS>;
type DefaultPluginMapExtend<T extends Array<PluginConstructor>> = PulginMap<T> & PulginMap<DEFAULT_PLUGINS>;

export interface CalendarExport extends WechatMiniprogram.IAnyObject {
  /** 版本号 */
  version: string;
  /**
   * 周/月面板跳转到指定日期
   */
  toDate(date: string | number | Date | CalendarDay): Promise<void>;
  /**
   * 年面板跳转到指定年
   */
  toYear(year: number): Promise<void>;
  /**
   * 周/月面板切换到视图
   * 若果view未指定，会在周月视图之间切换
   */
  toggleView(view?: CalendarView): void;
  /**
   * 获取插件
   */
  getPlugin<T extends Array<PluginConstructor>, K extends DefaultPluginKeyExtend<T> = DefaultPluginKeyExtend<T>>(
    key: K
  ): Voidable<DefaultPluginMapExtend<T>[K]>;
  /**
   * 更新插件日期数据
   */
  updatePluginDates(dates?: Array<CalendarDay>): Promise<void>;
}

/**
 * 组件工具类超类
 */
export class CalendarHandler {
  protected _instance_: CalendarInstance;

  constructor(component: CalendarInstance) {
    this._instance_ = component;
  }

  protected get _render_() {
    return this._instance_.renderer;
  }
}
