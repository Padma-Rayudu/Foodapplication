function updateProduct(e,i,foodppic,uuser)
{   console.log("hii");
   e.preventDefault();
    var updatedfood={
        foodname:document.editfood.foodname.value,
        noeat:document.editfood.noeat.value,
        price:document.editfood.price.value,
        remark:document.editfood.remark.value,
        delivery:document.editfood.delivery.value,
        foodpic:foodppic,
        user:uuser,
        id:i
    }
    console.log(updatedProduct);
    fetch('http://localhost:3500/product/updateProduct/'+i,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(updatedProduct),
    }).then(res=>{
        window.location.href="http://localhost:3500/product/"
    })
}