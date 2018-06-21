import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import 'rxjs/Rx';

import { AuthService } from "./auth";
import { Recipe } from "../models/recipe";
import { Ingrediant } from "../models/ingrediant";

import {firebaseConfig} from '../app/firebase-config';

@Injectable()
export class RecipesService {
  private recipes: Recipe[] = [];

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  addRecipe(title: string, description: string, difficulty: string, ingrediants: Ingrediant[]) {
    this.recipes.push(new Recipe(title, description, difficulty, ingrediants));
    console.log(this.recipes); 
  }

  getRecipes() {
    return this.recipes.slice();
  }

  updateRecipe(index: number, title: string, description: string, difficulty: string, ingrediants: Ingrediant[]) {
    this.recipes[index] = new Recipe(title, description, difficulty, ingrediants);
  }

  removeRecipe(index: number) {
    this.recipes.splice(index, 1);
  }

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.put(firebaseConfig.databaseUrl + userId + '/recipes.json?auth=' + token, this.recipes);
  }

  fetchList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get(firebaseConfig.databaseUrl + userId + '/recipes.json?auth=' + token)
      .map((response: Response) => {
        const recipes: Recipe[] = response ? response : [];
        for(let item of recipes) {
          if(!item.hasOwnProperty('ingrediants')) {
            item.ingrediants = [];
          }
        }

        return recipes;
      })
      .do((recipes: Recipe[]) => {
        if(recipes) {
          this.recipes = recipes;
        } else {
          this.recipes = [];
        }
      });
  }
}
