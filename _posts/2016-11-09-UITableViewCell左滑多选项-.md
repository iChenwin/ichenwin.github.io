title:  UITableViewCell左滑多选项 
date: 2016-11-09 22:58
tags: iOS
category: 技术笔记
---


    - (NSArray<UITableViewRowAction *> *)tableView:(UITableView *)tableView editActionsForRowAtIndexPath:(NSIndexPath *)indexPath
    {
        UITableViewRowAction *likeAction = [UITableViewRowAction rowActionWithStyle:UITableViewRowActionStyleNormal title:@"喜欢" handler:^(UITableViewRowAction * _Nonnull action, NSIndexPath * _Nonnull indexPath) {
          // 实现相关的逻辑代码
          // ...
          // 在最后希望cell可以自动回到默认状态，所以需要退出编辑模式
          tableView.editing = NO;
        }];
<!--more-->    
        UITableViewRowAction *deleteAction = [UITableViewRowAction rowActionWithStyle:UITableViewRowActionStyleDefault title:@"删除" handler:^(UITableViewRowAction * _Nonnull action, NSIndexPath * _Nonnull indexPath) {
          // 首先改变model
          [self.books removeObjectAtIndex:indexPath.row];
          // 接着刷新view
          [self.tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationAutomatic];
          // 不需要主动退出编辑模式，上面更新view的操作完成后就会自动退出编辑模式
        }];
    
        return @[deleteAction, likeAction];
    }

