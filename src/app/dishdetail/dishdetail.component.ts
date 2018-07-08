import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, FormGroupDirective} from '@angular/forms';

import { Dish } from '../shared/dish'; 
import { Comment } from '../shared/comment'; 
import { DishService } from '../services/dish.service';

import { visibility, flyInOut, expand } from '../animations/app.animation';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),   
      visibility(),
      expand()
    ]
})
export class DishdetailComponent implements OnInit {
  
  commentForm: FormGroup;
  comment: Comment;
  dish: Dish;
  dishcopy = null;
  dishIds: number[];
  prev: number;
  next: number;
  test: string;
  @ViewChild(FormGroupDirective) commentFormDirective;
  errMess: string;
  visibility = 'shown';

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
    private fb: FormBuilder, @Inject("BaseURL") private BaseURL) {
      this.createFrom();
     }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params:Params) => {this.visibility='hidden'; return this.dishService.getDish(+params.id)}))
    .subscribe(dish => {this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility='shown';}, errmess => this.errMess = errmess);
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
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save().subscribe( dish => this.dish = dish);
    console.log(this.comment);
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });

    this.commentFormDirective.resetForm();
  }
}
