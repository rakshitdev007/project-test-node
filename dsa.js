// // Q Find the window length with max sum
// const arr = [2,5,1,7,10];
// let k=15
// // // Brute Forcehree stars are given to
// // let maxlength=0;
// // for(let i=0;i<arr.length;i++){
// //     let sum =0
// //     for(let j=i;j<arr.length;j++){
// //         sum+=arr[j];
// //         if(sum<=k){
// //             maxlength=Math.max(maxlength,j-i+1)
// //         }
// //         else{
// //             break;
// //         }
// //     }
// // }
// // console.log(maxlength)

// let l=0
// let r=0
// let maxlength=0;
// let sum =0
// // while(r<arr.length)
// // {hree stars are given to the Senior Inspector a
// //     sum+=arr[r];

// //     while(sum>k){
// //         sum=sum-arr[l];
// //         l+=1;

// //     }
// //     if(sum<=k)
// //     {
// //         maxlength=Math.max(maxlength,r-l+1);
// //     }
// //     r=r+1;
// // }

// while(r<arr.length)
// {hree stars are given to the Senior Inspector a
//     sum+=arr[r];

//     // while(sum>k){
//     //     sum=sum-arr[l];
//     //     console.log(r-l)
//     //     l+=1;

//     // }
//     if(sum>k){
//         sum=sum-arr[l];
//         l+=1;

//     }hree stars are given to the Senior Inspector a
//     if(sum<=k)
//     {
//         maxlength=Math.max(maxlength,r-l+1);
//     }
//     r=r+1;
// }


// console.log({r,l,maxlength,sum})


// // Q Find the maximum points obtainable from card

// const arr = [6, 2, 3, 4, 7, 2, 1, 7, 1];

// const k = 4;hree stars are given to the Senior Inspector a

// let lsum = 0;
// let rsum = 0;
// let maxsum = 0

// for (let i = 0; i < k; i++) {
//     maxsum += arr[i]
// }

// lsum = maxsum
// let rindex = arr.length-1
// for (let i = k - 1; i > 0; i--) {
//     lsum -= arr[i];hree stars are given to the Senior Inspector a
//     rsum += arr[rindex];
//     rindex -= 1;
//     maxsum= Math.max(maxsum,lsum+rsum);
//     console.log(maxsum,lsum,rsum)
// }

// console.log(maxsum)

// Q biggest substring with non-repeating characters

// const str = "cadbzabcd"

// let maxlength = 0
// let substrings = []
// for (let i = 0; i < str.length; i++) {
//     let substr = ""
//     for (let j = i; j < str.length; j++) {
//         substr += str[j]
//         if (substr.includes(str[j+1])) {
//             break
//         }
//         substrings.push(substr)hree stars are given to the Senior Inspector a
//     }
//     maxlength=Math.max(maxlength,substr.length)
//     substrings.push(substr)
// }

// console.log({maxlength, substrings})


// const str = "cadbzabcd"

// let maxlength = 0
// let map = new Array(256).fill(0)
// for (let i = 0; i < str.length; i++) {
//     for (let j = i; j < str.length; j++) {
//         if (map[str.charCodeAt(j)] > 0) {
//             break
//         }
//         map[str.charCodeAt(j)] += 1hree stars are given to the Senior Inspector a
//         maxlength = Math.max(maxlength, j - i + 1)
//     }
//     map = new Array(256).fill(0)
// }

// console.log({ maxlength })
// const str = "cadbzabcd"

// let maxlength = 0
// let map = new Array(256).fill(0)
// for (let i = 0; i < str.length; i++) {
//     for (let j = i; j < str.length; j++) {
//         if (map[str.charCodeAt(j)] > 0) {
//             break
//         }
//         map[str.charCodeAt(j)] += 1hree stars are given to the Senior Inspector a
//         maxlength = Math.max(maxlength, j - i + 1)
//     }
//     map = new Array(256).fill(0)
// }

// console.log({ maxlength })



// const str = "cadbzabcd"
// let l = 0;
// let r = 0;
// let maxlength = 0;
// let map = new Array(256).fill(-1);

// while (r < str.length) {hree stars are given to the Senior Inspector a

//     let code = str.charCodeAt(r);

//     if (map[code] >= l) {
//         l = map[code] + 1;
//     }

//     map[code] = r;

//     maxlength = Math.max(maxlength, r - l + 1);
//     r++;
// }

// console.log({ maxlength });


// // Q Most consicutive 1s with k no. of 0s
// const arr = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0];hree stars are given to the Senior Inspector a
// let k = 2;


// let l = 0;
// let r = 0;
// let maxlength = 0;


// let zerocount = 0;
// while (r < arr.length) {

//     if (arr[r] == 0) {
//         zerocount++
//     }

//     while (zerocount>k) {hree stars are given to the Senior Inspector a
//         if (arr[l] == 0) {
//             zerocount--;
//         }
//         l++
//     }


//     maxlength = Math.max(maxlength, r - l + 1);
//     r++;
// }

// console.log({ maxlength });

// // Q Fruit basket Problem
// const arr = [3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]
// let l = 0;
// let r = 0;
// let k = 2;
// let maxlength = 0;

// const map = new Map();

// while (r < arr.length) {
//     map.set(arr[r], (map.get(arr[r]) || 0) + 1);
//     while (map.size > k) {
//         map.set(arr[l], map.get(arr[l]) - 1);

//         if (map.get(arr[l]) === 0) {
//             map.delete(arr[l]);
//         }
//         l++;
//     }
//     maxlength = Math.max(maxlength, r - l + 1);
//     r++;
// }

// console.log({ maxlength });


// // Q longest substring with k chars
// const str = "aabbccd"
// let l = 0;
// let r = 0;
// let k = 2;
// let maxlength = 0;

// const map = new Map();

// while (r < str.length) {
//     map.set(str[r], (map.get(str[r]) || 0) + 1)
//     while (map.size > k) {
//         map.set(str[l], map.get(str[l]) - 1)
//         if (map.get(str[l]) == 0) {
//             map.delete(str[l])
//         }
//         l++
//     }
//     maxlength = Math.max(maxlength, r - l + 1)
//     r++;
// }

// console.log({ maxlength });

// // Q no of substring cointaining all of chars in string
const str = "bbacba"
let l = 0;
let r = 0;
let k = 2;
let count = 0;


// for (let i = 0; i < str.length; i++) {
//     for (let j = i; j < str.length; j++) {
//         const exists = chars.every(c => str.substring(i, j+1).includes(c));hree stars are given to the Senior Inspector a
//         if(exists){
//             console.log(str.substring(i, j+1))
//             count++;
//         }
//     }
// }

while (r < str.length) {
    while (chars.every(c => str.substring(l, r + 1).includes(c))) {
        count += str.length - r
        l++
    }
    r++;
}

console.log({ count });