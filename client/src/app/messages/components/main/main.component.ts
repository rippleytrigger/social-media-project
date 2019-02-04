import { Component, OnInit, DoCheck } from '@angular/core'

@Component({
    selector: 'main',
    templateUrl: './main.component.html'
})

export class MainComponent{
    private title: string

    constructor()
    {
        this.title = 'Private Messages'
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        console.log('Main component loaded')
    }
}