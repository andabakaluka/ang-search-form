import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from './city';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public cities: City[];
  public displayErrorMessage = false;

  constructor(private http: HttpClient) {
  }

  onSearchChange(value: string): void {
    if(value.length < 2) {
      this.displayErrorMessage = false;
      this.cities = [];
      return;
    }
    console.log(value);


    this.fetchData().subscribe(
      then => {
        // filter on clientside
        this.cities = then;

        this.cities = this.cities.filter(function(city) {
          return city.city.toLowerCase().search(
            value.toLowerCase()) !== -1;
        });

        this.displayErrorMessage = (this.cities.length == 0) ? true : false;
      },
      fail => {
        console.log('nope');  
      }
    );
  }

  fetchData(): Observable<City[]> {
    return this.http.get<City[]>('/assets/data.json')
        .pipe(
          catchError(this.handleError<City[]>('City'))
       )
  }

  /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
          // Let the app keep running by returning an empty result.
          return of(result as T);
      };
  }
  
  ngOnInit() {

  }



}
