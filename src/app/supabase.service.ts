import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  createClient,
  Provider,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from './environment';
import { Sport } from './model/sport';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public db: SupabaseClient;
  token: string | undefined;

  constructor() {
    this.db = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  getSession(): Session | null {
    return this.db.auth.session();
  }

  // signUp(email: string, password: string) {
  //   return this.db.auth.signUp({ email, password });
  // }

  signIn(email: string, password: string) {
      return this.db.auth.signIn({ email, password })
  }

  accessToken;
  refreshToekn;

  setToken(response) {
    if ( !response?.session?.access_token) {
      return "noUser";
    } else {
      this.accessToken = response.session.access_token
      this.refreshToekn = response.session.refresh_token
      return response.user.email;
    }
  }

  // signInWithProvider(provider: Provider) {
  //   return this.db.auth.signIn({ provider });
  // }

  signOut() {
    this.db.auth.signOut().catch(console.error);
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.db.auth.onAuthStateChange(callback);
  }

  resetPassword(email: string) {
    return this.db.auth.api.resetPasswordForEmail(email);
  }

  setNewPassword(newPassword: string) {
    return this.db.auth.update({ password: newPassword});
  }

  buildQuery(table:string, select:string, eq: {column, value} = null){
    let q = this.db.from(table).select(select);
    if(eq){
      q = q.eq(eq.column, eq.value);
    }
    return q;
  }

  async getMany(table:string, select:string, eq: {column, value} = null){
    const q = this.buildQuery(table, select, eq)
    let {data, error} = await q;
    if(error){
      alert(`Cannot recover ${table}, check console`) 
      console.log(error)
    }
    return data ?? [];
  }

  async getOne(table:string, select:string, eq:{column, value}=null){
    const q = this.buildQuery(table, select, eq)
    let {data, error} = await q.single()
    if(error){
      alert(`Cannot recover ${table}, check console`) 
      console.log(error)
    }
    return data ?? [];
  }



}
