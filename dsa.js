const arr = [2,5,1,7,10];
k=15
// let maxlength=0;
// for(let i=0;i<arr.length;i++){
//     let sum =0
//     for(let j=i;j<arr.length;j++){
//         sum+=arr[j];
//         if(sum<=k){
//             maxlength=Math.max(maxlength,j-i+1)
//         }
//         else{
//             break;
//         }
//     }
// }
// console.log(maxlength)

let l=0
let r=0
let maxlength=0;
let sum =0
// while(r<arr.length)
// {
//     sum+=arr[r];
    
//     while(sum>k){
//         sum=sum-arr[l];
//         l+=1;
        
//     }
//     if(sum<=k)
//     {
//         maxlength=Math.max(maxlength,r-l+1);
//     }
//     r=r+1;
// }

while(r<arr.length)
{
    sum+=arr[r];
    
    // while(sum>k){
    //     sum=sum-arr[l];
    //     console.log(r-l)
    //     l+=1;
        
    // }
    if(sum>k){
        sum=sum-arr[l];
        l+=1;
        
    }
    if(sum<=k)
    {
        maxlength=Math.max(maxlength,r-l+1);
    }
    r=r+1;
}


console.log({r,l,maxlength,sum})
