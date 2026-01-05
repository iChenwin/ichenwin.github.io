title:  UICollectionView的Cell加载动画 
date: 2017-03-10 16:24
tags: iOS
category: 技术笔记
---


    -(void)collectionView:(UICollectionView *)collectionView willDisplayCell:(UICollectionViewCell *)cell forItemAtIndexPath:(NSIndexPath *)indexPath {
    //    CGAffineTransformMake(a,b,c,d,tx,ty)
    //    ad缩放bc旋转tx,ty位移，基础的2D矩阵
        cell.transform = CGAffineTransformMakeScale(1.4, 1.4);//CGAffineTransformMake(1.4, 0, 0, 1.4, 10, 10);
        [UIView animateWithDuration:0.5 delay:0.0 options:UIViewAnimationOptionCurveEaseInOut animations:^{
            cell.transform = CGAffineTransformIdentity;
        } completion:nil];
    }
<!--more-->
