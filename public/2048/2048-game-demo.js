/**
 * 2048 Game Demo
 * Andris Mukans
 * 15.05.2015
 * 
 */

/**
 * Board - holds all global Game data, quick references to cells through Lanes or directly, handles moves on game board
 */
	 
	function Board(container) {
          this.face = container
          this.draw();
	}

	Board.prototype.draw = function () {

	  this.face.empty();
	  this.score_face = $('<div>Score: 0</div>').appendTo(this.face);
          this.score = 0;
          this.valid_move = false;
          this.moving_to = false;
          this.winned = false;
	  this.cells = [];
          this.blanks = [];
          this.rows = [new Lane(this),new Lane(this),new Lane(this),new Lane(this)];
          this.cols = [new Lane(this),new Lane(this),new Lane(this),new Lane(this)];
	  
	  for (var x=0;x<4;x++) {
            for (var y=0;y<4;y++) {
		this.cells.push(new Cell(this));
                var cell = this.cells[this.cells.length-1];
		this.rows[x].add(cell);
		this.cols[y].add(cell);
	    }
          }
	  this.pop_random_cell();
	}

	Board.prototype.pop_random_cell = function () {
	  cell = this.blanks[Math.floor(Math.random() * this.blanks.length)]; 
	  if (cell) cell.fill(Math.round(1+Math.random())*2, '#ffc');
	}

	Board.prototype.add_score = function (score) {
	  this.score += parseInt(score);
	  this.score_face.text('Score: '+this.score);		  				
	}

	Board.prototype.finish_move = function () {
          this.valid_move = false;
	  for (var index in this.cells) {
		this.cells[index].just_merged=false;
	  }
	  if (this.winned) alert("Congratulations, You win!");

	  //TODO Add 'Game over' check this.blanks.length==0 and no option to merge
	}

	Board.prototype.do_move = function(key_code) {
            var axis = { 38: 'cols', 40:'cols', 37:'rows', 39:'rows' }[key_code];
	    var polarity = { 38: '', 40:'_backwards', 37:'', 39:'_backwards' }[key_code];
            if (axis) for (lane in this[axis]) { this[axis][lane]['stack'+polarity](); }
	    if (this.valid_move) this.pop_random_cell();
	    this.finish_move();				
	}


/**
 * Lane - single column or row of Board, holding references to four cells each. Used for ease of calculation, as interaction between cells in a game happens only within the same Lane.
 */

	function Lane(board) {
	  this.board = board
	  this.cells = []
	}

	Lane.prototype.add = function (cell) {
	  this.cells.push(cell);
	}

	Lane.prototype.get_source_for = function (target,action) {
	  var source = false;
	  var next = this.cells[this.cells.indexOf(target)+1];
	  if (next) {
	     if (action == 'move') {
		if (next.is_blank() ) {
		  source = this.get_source_for(next,action)
		} else {
		  source = next;
		}
	     } else if (action == 'merge' && next.value == target.value) { 
		source = next;
	     }
	  }
	  return source;
	}

	Lane.prototype.try_cell = function (target,action) {

	  var source = this.get_source_for(target,action);
	  if (source) {
	     target[action](source);
	     var prev = this.cells[this.cells.indexOf(target)-1];
	     if (prev && prev.value == target.value) prev.merge(target);
	     this.try_cell(target, target.is_blank() ? 'move' : 'merge');
	     return true; 
	  }
	}

	Lane.prototype.stack_backwards = function () {
	  this.cells.reverse();
	  this.stack();
	  this.cells.reverse();			
	}

	Lane.prototype.stack = function () {
	  for(var index in this.cells) {
		var target = this.cells[index];
		this.try_cell(target, target.is_blank() ? 'move' : 'merge');
	  }
	}


/**
 * Cell - either filled or blank tile of the game board. Holds cell values, performs move and merge, renders visuals on board.
 */

	function Cell(board) {
	  this.value = '';
          this.board = board;
	  this.face = $('<p></p>').appendTo(this.board.face);
          this.just_merged = false;
          this.mark_as_blank();
	}
				
	Cell.prototype.fill = function (value,effect) {

	  this.value = value;
          this.mark_as_filled();
          this.face.text(this.value);
	  if (this.value == 2048) this.board.winned = true;
          var shade = Math.min(255,128+Math.round((this.value/256)*255)).toString(16);
          if (effect) this.face.animate({backgroundColor: effect},100).animate({backgroundColor: '#'+shade+shade+shade},1000);
          else this.face.animate({backgroundColor: '#'+shade+shade+shade}, 100);
	  
   	}

	Cell.prototype.clear = function () {
	  this.value = '';
          this.just_merged = false;
	  this.mark_as_blank();
	  this.face.empty();
	  this.face.stop(true,true).css({backgroundColor: '#aaa',opacity:1});
          
	}

	Cell.prototype.merge = function (source) {
	  if (!source.just_merged && !this.just_merged) {
	  	this.fill(this.value+source.value,'#590');
	  	this.just_merged = true;
	  	this.board.add_score(this.value);
		this.board.valid_move = true;
		source.clear();
	  }
	}

	Cell.prototype.move = function (source) {
	  this.fill(source.value,false);
	  this.board.valid_move = true;
	  source.clear();
	}
	  

	Cell.prototype.mark_as_filled = function () {
	  var filled = this.board.blanks.indexOf(this);
	  if (filled >= 0) this.board.blanks.splice(filled,1);
	  this.board.blanks=this.board.blanks.filter(function(){return true;})
        }
	
	Cell.prototype.mark_as_blank = function () {
          if (!(this.board.blanks.indexOf(this)>=0)) this.board.blanks.push(this);
	}

	Cell.prototype.is_blank = function () {
	  return !(parseInt(this.value)>0);
	}


