export type AddPageWatermarkOptionsType={
    /**
   * 绘制文本的 x 坐标位置
   */
  xIndex?:number
    /**
   * 绘制文本的 y 坐标位置
   */
  yIndex?:number
   /**
   * textArr为数组时的行间间隔
   */
  xInterval?:number
  /**
   * canvas 宽度
   */
  canWidth?:number
  /**
   * canvas 高度
   */
  canHeight?:number
  /**
   * CanvasRenderingContext2D 旋转角度
   */
  canRotate?:number
  canFont ?: CanvasTextDrawingStyles["font"]
  canFillStyle ?: CanvasFillStrokeStyles["fillStyle"]
  canTextAlign ?:CanvasTextDrawingStyles['textAlign']
  canTextBaseline ?: CanvasTextDrawingStyles['textBaseline']
  /**
   * canvas文字最大宽度
   */
  cansTextMaxWidth?:number

}
// 测试变动
export class AddPageWatermark {
  /**
   * 水印默认配置
   */ 
  static normalAddPageWatermarkOption:Required<AddPageWatermarkOptionsType>={
    xIndex:15,
    yIndex:100,
    xInterval:25,
    canWidth:600,
    canHeight:200,
    canRotate:270,
    canFont : '17px',
    canFillStyle : 'rgba(0, 0, 0, 0.20)',
    canTextAlign :'left',
    canTextBaseline : 'middle',
    cansTextMaxWidth:470,
  }
  static watermarkId:number=0
  /**
   * 加入水印的容器
   */ 
  private container:HTMLElement
  /**
   * 水印配置
   */
  public options:Required<AddPageWatermarkOptionsType>
  /**生成的水印元素id */
  private id:string
  /**
   * 去除container上的水印
   */
  public unbind:(()=>void)|null=null
  /**
   * @param options  水印配置
   * @param container  加入水印的容器
  */
  constructor(options:AddPageWatermarkOptionsType, container:HTMLElement) {
    this.container = container
    this.options = Object.assign(AddPageWatermark.normalAddPageWatermarkOption,options||{})
    this.id= 'watermarkpage___'+AddPageWatermark.watermarkId
    AddPageWatermark.watermarkId++
  }
  private setWatermark(textArr:string[]|string) {
    const options=this.options
    let xIndex = options.xIndex 
    let yIndex = options.yIndex 
    let xInterval = options.xInterval 
    const ele = document.getElementById(this.id)
    if (ele !== null) {
      ele?.parentNode?.removeChild(ele)
    }
    let can: HTMLCanvasElement = document.createElement('canvas')
    can.width = options.canWidth
    can.height = options.canHeight
    let cans = can.getContext('2d') as CanvasRenderingContext2D
    cans.rotate(options.canRotate)
    cans.font =options.canFont
    cans.fillStyle = options.canFillStyle
    cans.textAlign = options.canTextAlign
    cans.textBaseline = options.canTextBaseline
    textArr=Array.isArray(textArr)?textArr:[textArr]
    for (let i = 0; i < textArr.length; i++) {
      cans.fillText(textArr[i], xIndex, yIndex, options.cansTextMaxWidth)
      yIndex += xInterval
    }
    // 创建div用于显示
    let div = document.createElement('div')
    div.id = this.id
    div.style.pointerEvents = 'none'
    div.style.top = '0'
    div.style.left = '0'
    div.style.position = 'absolute'
    div.style.zIndex = '100000'
    div.style.width = '100%'
    div.style.height = this.container.offsetHeight + 'px'
    div.style.background =
      'url(' + can.toDataURL('image/png') + ') left top repeat'
    this.container.appendChild(div)
    //   const style = document.createElement('style')
    //   style.type = 'text/css'
    //   style.setAttribute = ('type', 'text/css')
    //   style.innerHTML = `@media print{
    //     #${id}{
    //       positon:absolute!important;
  
    //     }
    // }`
    //   this.container.appendChild(style)
    return this.id
  }
  private createObserver( textArr:string[]|string) {
    let observer = new MutationObserver(() => {
      const ele=document.getElementById(this.id)
      if (ele === null) {
        this.id = this.setWatermark(textArr)
      } else {
        if (this.container.offsetHeight !== ele.offsetHeight) {
          ele.style.height = this.container.offsetHeight + 'px'
        }
      }
    })
  
    let option = {
      childList: true, 
      subtree: true 
    }
  
    observer.observe(document.body, option)
    return observer
  }
  /**
   * @param textArr 水印的文字
   * @returns unbind方法
   */
  public set(textArr:string[]|string):this['unbind'] {
    console.log(textArr)
    //   const args = Array.prototype.slice.apply(arguments)
    this.unbind && this.unbind()
    const id = this.setWatermark(textArr)
  
    // 创建观察器检测如果水印被去掉了，自动给加上
    const observer = this.createObserver(id)
    const resizeFun=() =>{
      this.setWatermark(textArr)
    }
    window.addEventListener('resize', resizeFun)
    const unbind = ()=> {
      observer.disconnect()
      window.removeEventListener('resize', resizeFun)
      this.container.removeChild(document.getElementById(id) as HTMLElement)
      this.unbind = null
    }
    this.unbind = unbind
    return unbind
  }
}

export default AddPageWatermark

