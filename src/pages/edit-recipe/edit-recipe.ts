import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { RecipesService } from '../../services/recipes';
import { Recipe } from '../../models/recipe';

@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {
  mode: string = 'New';
  selectOptions = ['Easy', 'Medium', 'Hard'];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private recipesService: RecipesService) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if(this.mode == 'Edit') {
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }

    this.initualizeForm();
  }

  onSubmit() {
    console.log(this.recipeForm);

    let ingrediants = [];

    if(this.recipeForm.value.ingrediants.length > 0) {
      ingrediants = this.recipeForm.value.ingrediants.map((name) => {
        return {name: name, amount: 1};
      })
    }

    if(this.mode == 'Edit') {
      this.recipesService.updateRecipe(this.index, this.recipeForm.value.title, this.recipeForm.value.description, this.recipeForm.value.difficulty, ingrediants);
    } else {
      this.recipesService.addRecipe(this.recipeForm.value.title, this.recipeForm.value.description, this.recipeForm.value.difficulty, ingrediants);
    }

    this.navCtrl.popToRoot();
  }

  onManageIngrediants() {
    const actionSheet = this.actionSheetCtrl.create({
      title: "What do you want to do?",
      buttons: [
        {
          text: 'Add Ingrediant',
          handler: () => {
            this.createNewIngrediantAlert().present();
          }
        },
        {
          text: 'Remove all Ingrediants',
          role: 'destructive',
          handler: () => {
            const fArray: FormArray = <FormArray>this.recipeForm.get('ingrediants');
            const len = fArray.length;
            if(len > 0) {
              for(let i = len - 1; i >= 0; i--) {
                fArray.removeAt(i);
              }

              const toast = this.toastCtrl.create({
                message: 'All Ingrediants were deleted!',
                duration: 1500,
                position: 'bottom'
              });
  
              toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  private createNewIngrediantAlert () {
    return this.alertCtrl.create({
      title: 'Add Ingrediant',
      inputs: [
        {
          name: 'name',
          placeholder: 'name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (data.name.trim() == '' || data.name == null) {
              const toast = this.toastCtrl.create({
                message: 'Please enter a valid value',
                duration: 1500,
                position: 'bottom'
              });

              toast.present();

              return;
            }

            (<FormArray>this.recipeForm.get('ingrediants')).push(new FormControl(data.name, Validators.required));

            const toast = this.toastCtrl.create({
              message: 'Item added!',
              duration: 1500,
              position: 'bottom'
            });

            toast.present();
          }
        }
      ]
    });
  }

  private initualizeForm() {
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingrediants = [];

    if(this.mode == 'Edit') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for(let ingrediant of this.recipe.ingrediants) {
        ingrediants.push(new FormControl(ingrediant.name, Validators.required));
      }
    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingrediants': new FormArray(ingrediants)
    });
  }
}
