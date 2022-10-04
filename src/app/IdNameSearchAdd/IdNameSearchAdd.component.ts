import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter} from 'rxjs/operators';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-IdNameSearchAdd',
  templateUrl: './IdNameSearchAdd.component.html',
})
export class IdNameSearchAddComponent implements OnInit {

  @Input() title = 'title'
  @Input() table = 'table'
  @Input() idField = 'idField'
  
  db: SupabaseClient;
  searchModel: any;
  records: any[];

  userId:string; 
  constructor(private readonly supaSvc: SupabaseService) {
    this.db = supaSvc.db;
    this.userId = supaSvc.getSession()?.user?.id as string
  }
 
  
  async ngOnInit() {
    let { data: records, error } = await this.db
    .from(this.table)
    .select('*')
    .order(this.idField, { ascending: false })
  
    if (error) {
      alert('supaService: ' + error.message);
    } else {
      this.records = records
    }

  }

  onModelChange(event){
    this.itemSelected = false;
  }

  itemSelected = false;
  onSelectItem(event) {
    this.itemSelected = true;
  }

  async add() {
    if(this.itemSelected)
      return;

    if(! this.searchModel || this.searchModel === '')
      return;

    let { data: existingPlayer} = await this.db.from('Players')
    .select('*')
    .eq(`name`, this.searchModel)
    .single();
    if (existingPlayer != null){
      alert(this.searchModel + ' already exists');
      return;
    }
    
    let { data: record, error } = await this.db.from(this.table)
    .insert({name: this.searchModel, user_id: this.userId}) 
    .single()
    if (error) {
      alert(error.message);
    } else {
      this.records.push(record);
    }
  }
  
  formatter = (p:any) => p.name;
  search: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) => 
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 1),
      map(term => 
        this.records.filter(p => new RegExp(term, 'mi').test(p.name)).slice(0, 10))
  );

}
