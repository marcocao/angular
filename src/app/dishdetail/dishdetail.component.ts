import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Dish } from '../shared/dish'; 
import { Comment } from '../shared/comment'; 
import { DishService } from '../services/dish.service';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  
  commentForm: FormGroup;
  comment: Comment;
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  test: string;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
    }
  };

  constructor(private dishService: DishService, private route: ActivatedRoute, private location: Location, 
    private fb: FormBuilder) {
      this.createFrom();
     }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params:Params) => this.dishService.getDish(+params.id)))
    .subscribe(dish => {this.dish = dish; this.setPrevNext(dish.id);});
  }

  setPrevNext(dishId: number)
  {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

  createFrom(){
    this.commentForm = this.fb.group({
      author:['',[Validators.required, Validators.minLength(2)]],
      rating: 5,
      comment:['', Validators.required]
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    
    this.onValueChanged();//reset form validation msg
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dish.comments.push(this.comment);
    console.log(this.comment);
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
  }
}
