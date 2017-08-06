const allItems = require('./items').loadAllItems();
const promotions = require('./promotions').loadPromotions();

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

function Thirty_Six(formatItems){
    let cost = 0;
    formatItems.forEach( (item)=>{
        cost += item.price * item.count;        
    })
    if( cost >= 30 )
        cost -= 6;
    return {type:'满30减6元' , cost:cost , items:[]};
}

function halfFare(formatItems){
    let cost = 0;
    let items = [];
    formatItems.forEach( (item)=>{
        if( promotions[1].items.includes(item.id) ){
            cost += item.price / 2 * item.count;
            items.push(item.name);
        }
        else
            cost += item.price * item.count;
    })
    return {type:'指定菜品半价' , cost:cost , items:items};
}

function originalPrice(formatItems){
    let cost = 0;
    formatItems.forEach( (item)=>{
        cost += item.count * item.price;
    })
    return {type:'original_price', cost:cost , items:[]};
}

function compareCost(kindsCost){
    return kindsCost.sort( (x,y)=>{ return x.cost - y.cost; });
}

function countCost(formatItems){
    let kindsCost = [];
    kindsCost.push(Thirty_Six(formatItems));
    kindsCost.push(halfFare(formatItems));
    kindsCost.push(originalPrice(formatItems));
    kindsCost = compareCost(kindsCost);
    let flag = 0;
    if( kindsCost[0].cost - kindsCost[kindsCost.length - 1].cost === 0)
    	flag = kindsCost.length - 1;
    return {type:kindsCost[flag].type , cost:kindsCost[flag].cost , 
            save:kindsCost[kindsCost.length - 1].cost - kindsCost[flag].cost , 
            items:kindsCost[flag].items};    
}

function showInfo(formatItems,finalCost){
    let info = '============= 订餐明细 =============';
    formatItems.forEach( (item)=>{
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
        info += '\n使用优惠:\n' + '指定菜品半价(';
        for (var i = 0; i < finalCost.items.length; i++) {
            if( i !== finalCost.items.length - 2 )
                info += '，';
            info += finalCost.items[i];
        }
        info += ')，' + '省' + finalCost.save + '元';
        info += '\n-----------------------------------';
    }
    else if( finalCost.type === '满30减6元' ){
        info += '\n使用优惠:\n' + finalCost.type + '，省'+ finalCost.save + '元';
        info += '\n-----------------------------------';
    }
    info += '\n总计：' + finalCost.cost + '元';
    info += '\n==================================='
    return info;
} 

exports.bestCharge = function(selectedItems) {
	let formatItems = formatInput(selectedItems);
	let finalCost = countCost(formatItems);
	return showInfo(formatItems , finalCost);
}
