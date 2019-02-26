//  如果导入但未使用，则由于 treeshaking 的作用不会被打包
// import _ from "lodash-es"
export default function printMe() {    
    //  lazy-load
    import(/* webpackChunkName: "lazy-load" */ './lazy-load.js')
}