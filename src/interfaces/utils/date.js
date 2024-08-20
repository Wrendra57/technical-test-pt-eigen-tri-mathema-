const dueDateGenerator= async (hari) =>{
    const now = new Date();

    const dueDate = new Date();
    dueDate.setDate(now.getDate() + hari);

    return {now: now, dueDate:dueDate}
}
module.exports={dueDateGenerator}