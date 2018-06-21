import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {
  mode: string = 'New';
  selectOptions = ['Easy', 'Medium', 'Hard'];
  recipeForm: FormGroup;

  constructor(private navParams: NavParams, private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    this.initualizeForm();
  }

  onSubmit() {
    console.log(this.recipeForm);
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
              return;
            }

            (<FormArray>this.recipeForm.get('ingrediants')).push(new FormControl(data.name, Validators.required));
          }
        }
      ]
    });
  }

  private initualizeForm() {
    this.recipeForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'difficulty': new FormControl('Medium', Validators.required),
      'ingrediants': new FormArray([])
    });
  }
}
