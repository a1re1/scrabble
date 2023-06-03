'use strict';

// define angular app (with dependency on Wijmo)
var app = angular.module('app', ['wj']);

// define app's single controller
app.controller('appCtrl', function ($scope) {
    // hook up event handlers
    var cols = document.querySelectorAll('#game .tile');
    [].forEach.call(cols, function (col) {
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragenter', handleDragEnter, false)
        col.addEventListener('dragover', handleDragOver, false);
        col.addEventListener('dragleave', handleDragLeave, false);
        col.addEventListener('drop', handleDrop, false);
        col.addEventListener('dragend', handleDragEnd, false);
    });

    let dragSrcEl = null;

    function handleDragStart(e) {
        if (e.target.className.indexOf('tile') > -1) {
            dragSrcEl = e.target;
            dragSrcEl.style.opacity = '0.4';
            const dt = e.dataTransfer;
            dt.effectAllowed = 'move';
            dt.setData('text', dragSrcEl.innerHTML);

        }
    }
    function handleDragOver(e) {
        if (dragSrcEl) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    }
    function handleDragEnter(e) {
        if (dragSrcEl) {
            e.target.classList.add('over');
        }
    }
    function handleDragLeave(e) {
        if (dragSrcEl) {
            e.target.classList.remove('over');
        }
    }
    function handleDragEnd() {
        dragSrcEl = null;
        [].forEach.call(cols, function (col) {
            col.style.opacity = '';
            col.classList.remove('over');
        });
    }
    function handleDrop(e) {
        if (dragSrcEl) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            if (dragSrcEl !== this) {
                dragSrcEl.innerHTML = e.target.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text');
            }
        }
    }
});
