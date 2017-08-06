'use strict'
const allItems = require('./items').loadAllItems();
const promotions = require('./promotions').loadPromotions();
/*allItems
[ { id: 'ITEM0001', name: '黄焖鸡', price: 18 },
  { id: 'ITEM0013', name: '肉夹馍', price: 6 },
  { id: 'ITEM0022', name: '凉皮', price: 8 },
  { id: 'ITEM0030', name: '冰锋', price: 2 } ] 
promotions
[ { type: '满30减6元' },
  { type: '指定菜品半价', 
  items: [ 'ITEM0001', 'ITEM0022' ] } ]
*/
// let inputs = ["ITEM0013 x 4"];

// let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
function formatInput(selectedItems){
    let formatItems = [];
    selectedItems.forEach( (item)=>{
        let site = allItems.findIndex( (obj)=>{
            return obj.id === item.split(' ')[0];
        })
        formatItems.push({id:item.split(' ')[0] , count:parseInt(item.split(' ')[2]) ,
                          name:allItems[site].name , price:allItems[site].price});
    })    
    return formatItems;
}
// console.log(formatInput(inputs));


function Thirty_Six(selectedItems){
    let cost = 0;
    selectedItems.forEach( (item)=>{
        cost += item.price * item.count;        
    })
    if( cost >= 30 )
        cost -= 6;
    return {type:'满30减6元' , cost:cost , items:[]};
}

function halfFare(selectedItems){
    let cost = 0;
    let items = [];
    selectedItems.forEach( (item)=>{
        if( promotions[1].items.includes(item.id) ){
            cost += item.price / 2 * item.count;
            items.push(item.id);
        }
        else
            cost += item.price * item.count;
    })
    return {type:'指定菜品半价' , cost:cost , items:items};
}
function originalPrice(selectedItems){
    let cost = 0;
    selectedItems.forEach( (item)=>{
        cost += item.count * item.price;
    })
    return {type:'original_price', cost:cost , items:[]};
}

function compareCost(kindsCost){
    return kindsCost.sort( (x,y)=>{ return x.cost - y.cost; });
}

function countCost(selectedItems){
    let kindsCost = [];
    kindsCost.push(Thirty_Six(selectedItems));
    kindsCost.push(halfFare(selectedItems));
    kindsCost.push(originalPrice(selectedItems));
    kindsCost = compareCost(kindsCost);
    return {type:kindsCost[0].type , cost:kindsCost[0].cost , 
            save:kindsCost[2].cost - kindsCost[0].cost , 
            items:kindsCost[0].items};    
}

let finalCost = countCost(formatInput(inputs));
let selectedItems = formatInput(inputs);
/*[ { id: 'ITEM0001', count: 1, name: '黄焖鸡', price: 18 },
  { id: 'ITEM0013', count: 2, name: '肉夹馍', price: 6 },
  { id: 'ITEM0022', count: 1, name: '凉皮', price: 8 } ]*/
  /*
[ { type: '满30减6元', cost: 32 },
  { type: '指定菜品半价', cost: 25, item: [ 'ITEM0001', 'ITEM0022' ] },
  { type: 'original_price', cost: 38 } ]

  { type: '指定菜品半价', cost: 25, save: 13 }

*/
function showInfo(selectedItems,finalCost){
    let info = '============= 订餐明细 =============';
    selectedItems.forEach( (item)=>{
        info += '\n' + 
                item.name + 
                ' x ' + 
                item.count + 
                ' = ' + 
                item.price * item.count + 
                '元';
    })
    info += '\n-----------------------------------';
    if( finalCost.type === '指定菜品半价' ){
        info += '\n' + '使用优惠:' + '指定菜品半价(';
        for (var i = 0; i < finalCost.items.length; i++) {
            info += finalCost.items[i];
            if( i !== finalCost.items.length - 2 )
                info += '，';
        }
        info += ')，' + '省' + finalCost.save + '元';
    }
    else if( finalCost.type === '满30减6元' ){
        info += '\n' + '使用优惠:' + '\n' + finalCost.type + '，省'+ finalCost.save + '元';
    }
    info += '\n' + '总计：' + finalCost.cost + '元';
    info += '\n==================================='
    return info;
} 

console.log(showInfo(selectedItems , finalCost));










