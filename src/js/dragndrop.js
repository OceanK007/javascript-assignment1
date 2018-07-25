
// START : drag and drop functionality //
export class DragNDrop 
{
    static init() 
    {
        let draggableElement = "";
        let insertBeforeElement = "";
        DragNDrop.applyEventsForInnerContainer();
        //DragNDrop.applyEventsForOuterContainer();
    }

    // static applyEventsForOuterContainer()
    // {
    //     let outerHolders = document.getElementById('card-list-holder');
    //     let innerBoxes = document.getElementsByClassName('list-box');

    //     //console.log(outerHolders);
    //     //console.log(innerBoxes);

    //     for(const b of innerBoxes)
    //     {
    //         //console.log(b);
    //         if(b.getAttribute('draggable') == null)
    //         {
    //             //b.setAttribute('draggable', 'true');
    //             //b.addEventListener("dragstart", function(){DragNDrop.dragstart(event,this);})
    //             //b.addEventListener("dragend", function(){DragNDrop.dragend(event);})
    //         }
    //     }

    //     if(outerHolders.getAttribute('dragcount') == null)
    //     {
    //         //outerHolders.setAttribute('dragcount', '1');
    //         //outerHolders.addEventListener("dragover", function(){DragNDrop.dragoverOuter(event, this);})
    //         //outerHolders.addEventListener("dragenter", function(){DragNDrop.dragenter(event, this);})
    //         //outerHolders.addEventListener("dragleave", function(){DragNDrop.dragleave(event, this);})
    //         //outerHolders.addEventListener("drop", function(){DragNDrop.dropOuter(event,this)})
    //     }
    // }

    static applyEventsForInnerContainer()
    {
        let boxes = document.getElementsByClassName('box');
        let holders = document.getElementsByClassName('holder');
        //console.log(boxes);
        //console.log(holders);

        for(const b of boxes)
        {
            //console.log(b);
            if(b.getAttribute('draggable') == null)
            {
                b.setAttribute('draggable', 'true');
                b.addEventListener("dragstart", function(){DragNDrop.dragstart(event,this);})
                b.addEventListener("dragend", function(){DragNDrop.dragend(event);})
            }
        }

        for(const h of holders) 
        {
            //console.log(h);
            if(h.getAttribute('dragcount') == null)
            {
                h.setAttribute('dragcount', '1');
                h.addEventListener("dragover", function(){DragNDrop.dragover(event, this);})
                h.addEventListener("dragenter", function(){DragNDrop.dragenter(event, this);})
                h.addEventListener("dragleave", function(){DragNDrop.dragleave(event, this);})
                h.addEventListener("drop", function(){DragNDrop.drop(event,this)})
            }
        }
    }

    static dragstart(e, ref) 
    {
        //console.log(e);
        console.log(ref);
        this.draggableElement = ref;
        //console.log(this.draggableElement);
    }

    static dragend(e) 
    {
        //console.log("end");
    }

    static dragover(e) 
    {
        e.preventDefault();
        //e.stopPropagation();
        var target = e.target;

        if(this.draggableElement == e.target)
        {
            console.log("Over");
        }
        else
        {
            //console.log(target.className);
            this.insertBeforeElement = target;
            // console.log(this.insertBeforeElement);
        }
    }

    static dragenter(e) 
    {
        e.preventDefault();
        //console.log("enter");
        //console.log(e.target);
    }

    static dragleave(e) 
    {
        //console.log("leave");
        //console.log(e.target);
    }

    static drop(e, ref) 
    {
        e.stopPropagation();
        if(this.insertBeforeElement.className == 'holder')  // Empty container
        {
            ref.append(this.draggableElement);
        }
        else
        {
            ref.insertBefore(this.draggableElement, this.insertBeforeElement);
        }
    }
}
// END : drag and drop functionality //
