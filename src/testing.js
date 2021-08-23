// duplicates 

const numArr = [12,12, 14, 22, 33, 14, 25, 22];

let uniqueNum = [];

for(let i = 0; i < numArr.length; i++){
    const element = numArr[i];
    let index = uniqueNum.indexOf(element);

    if(index === -1){
        uniqueNum.push(element);
    }
}
console.log(uniqueNum);
